// // // import multer from "multer";

// // // const storage = multer.memoryStorage();
// // // export const singleUpload = multer({storage}).single("file");

// // import multer from "multer";

// // // Configure multer storage
// // const storage = multer.memoryStorage(); // Or use diskStorage if saving to disk

// // // Optionally, define file filter and limits if needed
// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith("image/")) {
// //     cb(null, true); // Accept file
// //   } else {
// //     cb(new Error("Invalid file type, only images are allowed!"), false); // Reject file
// //   }
// // };

// // const upload = multer({
// //   storage: storage,
// //   fileFilter: fileFilter, // Optional: Add a file filter
// //   limits: {
// //     fileSize: 5 * 1024 * 1024, // 5MB file size limit (optional)
// //   },
// // });

// // export default upload;

// import multer from "multer";

// // Configure multer storage
// const storage = multer.memoryStorage(); // Or use diskStorage if saving to disk

// // Define file filter to accept only image files
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true); // Accept file
//   } else {
//     cb(new Error("Invalid file type, only images are allowed!"), false); // Reject file
//   }
// };

// // Create multer instance
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB file size limit (optional)
//   },
// });

// export default upload;

import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage(); // Use diskStorage if saving to disk

// Define file filter to accept both image and PDF files
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true); // Accept image or PDF file
  } else {
    cb(
      new Error("Invalid file type, only images and PDFs are allowed!"),
      false
    ); // Reject file
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

export default upload;
