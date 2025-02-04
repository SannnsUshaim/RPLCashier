import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
}).array("image", 12);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 },
}).single("image");

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimeType);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images only.")
  }
}