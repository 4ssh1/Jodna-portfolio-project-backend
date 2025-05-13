const multer = require('multer');

// Memory storage (no disk file)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) { 
      cb(null, true); //cb(error, accept file) null i.e if there's no error, accept file
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
})

module.exports = upload;\

// Even if a file has a .png or .jpeg extension, Multer doesn't trust file extensions alone. It checks the MIME type that 
// the browser or HTTP client sends during upload, which should correctly indicate whether it's truly an image.

// .png   =   image/png
// .jpg/.jpeg	  =   image/jpeg
// .gif   =    image/gif

// If a non-image file is renamed to .png, its MIME type will not start with "image/" unless they tamper with 
// the HTTP request (which a browser usually doesn't allow). 
//Prevents non-image files (e.g., .exe, .zip, .pdf) from being uploaded



