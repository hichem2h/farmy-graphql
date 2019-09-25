import fs from 'fs'
import AWS from 'aws-sdk'
import request from 'request-promise-native'
import shortid from 'shortid'
import { ValidationError } from 'apollo-server';
import { AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, MODEL_URL } from '../../config'

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const uploadToFs = async (image) => {
  try {

    const { createReadStream, filename } = await image;
    const stream = createReadStream()
    const id = shortid.generate()
    const path = `uploads/${id}-${filename}`

    return new Promise((resolve, reject) =>
        stream
          .on('error', error => {
            if (stream.truncated)
              // Delete the truncated file.
              fs.unlinkSync(path)
            reject(error)
          })
          .pipe(fs.createWriteStream(path))
          .on('error', error => reject(error))
          .on('finish', () => resolve(path))
      )

  } catch (error) {
    if (error.name != 'PayloadTooLargeError') throw error
    throw new ValidationError(error.message);
  }
}

const uploadToS3 = async (image) => {
  try {

    const { createReadStream, filename } = await image;
    const stream = createReadStream()
    const id = shortid.generate()
    const path = `uploads/${id}-${filename}`

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: path,
      Body: stream
    };

    const s3upload = s3.upload(params).promise();
    return new Promise((resolve, reject) =>
      s3upload
        .then(data => {
              resolve(data.Location)
        })
        .catch(error => reject(path))
    )

  } catch (error) {
    if (error.name != 'PayloadTooLargeError') throw error
    throw new ValidationError(error.message);
  }
};


export const processImages = async (images) => {
  const urls = await Promise.all(images.map(uploadToS3))

  const response = await request({ url: MODEL_URL, method: 'POST', form: urls})
  const prediction = JSON.parse(response).prediction

  return [ urls, prediction ]
}