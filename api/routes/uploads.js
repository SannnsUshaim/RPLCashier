import express from "express";
import { upload } from "../middleware/multer.js";
import dotenv from "dotenv";
import { app } from "../config/config.cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
// import {
//   getStorage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../config/config.firebase.js";

dotenv.config();

cloudinary.config(app);

const router = express.Router();

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};
const uploads = multer({
  storage,
  fileFilter,
});

async function uploadFileToCloudinary(file) {
  try {
    // Upload file ke Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads", // Folder di Cloudinary
      resource_type: "auto", // Auto-detect resource type (image, video, etc.)
    });

    return {
      fileName: file.originalname,
      ref: result.secure_url, // URL file yang diunggah
      publicId: result.public_id, // Public ID untuk manajemen file di Cloudinary
    };
  } catch (error) {
    throw new Error("Error uploading file to Cloudinary: " + error.message);
  }
}

router.post("/", uploads.array("file"), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  try {
    const uploadedFiles = [];
    for (const file of req.files) {
      const uploadedFile = await uploadFileToCloudinary(file);
      uploadedFiles.push(uploadedFile);
    }

    return res.send({
      status: "SUCCESS",
      files: uploadedFiles,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// async function uploadFileToFirebase(file) {
//   const firebaseStorage = getStorage();
//   await signInWithEmailAndPassword(
//     auth,
//     process.env.FIREBASE_USER,
//     process.env.FIREBASE_AUTH
//   );

//   const dateTime = Date.now();
//   const fileName = `uploads/${dateTime}-${file.originalname}`;
//   const storageRef = ref(firebaseStorage, fileName);
//   const metadata = {
//     contentType: file.mimetype,
//   };

//   const snapshot = await uploadBytesResumable(
//     storageRef,
//     file.buffer,
//     metadata
//   );
//   const downloadURL = await getDownloadURL(snapshot.ref);

//   return {
//     fileName,
//     ref: downloadURL,
//   };
// }

// router.post("/", uploads.single("file"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   try {
//     const uploadedFile = await uploadFileToFirebase(req.file);
//     return res.send({
//       status: "SUCCESS",
//       fileName: uploadedFile.fileName,
//       ref: uploadedFile.ref,
//     });
//   } catch (error) {
//     return res.status(500).send("Error uploading file.");
//   }
// });

export default router;
