const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream);
  })
}

module.exports = uploadToCloudinary;
