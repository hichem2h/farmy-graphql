import fs from 'fs'
import AWS from 'aws-sdk'
import shortid from 'shortid'
import { ValidationError } from 'apollo-server';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from '../../config'

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const storeFs = async (image) => {
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

const uploadFileToS3 = async (image) => {
  const { createReadStream, filename } = await image;
  const stream = createReadStream()
  const id = shortid.generate()
  const path = `uploads/${id}-${filename}`

     const params = {
         Bucket: 'testBucket',
         Key: path,
         Body: JSON.stringify(stream, null, 2)
     };

     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         
         return data.Location
     });
};

export const processImages = async (images) => {
  const links = await Promise.all(images.map(storeFs))
  return links
}