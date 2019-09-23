import fs from 'fs'
import shortid from 'shortid'

const storeFs = async (image) => {
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
}

export const processImages = async (images) => {
  const links = await Promise.all(images.map(storeFs))
  return links
}