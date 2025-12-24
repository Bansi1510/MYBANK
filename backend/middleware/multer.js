import multer from "multer";

const storage = multer.memoryStorage();

export const dynamicUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only PDF, JPG, PNG files are allowed"),
        false
      );
    }
    cb(null, true);
  },
}).any(); // 👈 VERY IMPORTANT
