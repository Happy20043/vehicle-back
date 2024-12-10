const multer = require("multer");
const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
const multerS3 = require("multer-s3");
require('dotenv').config()
const sharp = require("sharp");
const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: region, // Replace with your preferred region
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: bucketName,
//     key: function (req, file, cb) {
//       const originalName = file?.originalname;
//       const extension = originalName.split(".").pop(); // Get the file extension
//       const filenameWithoutExtension = originalName.replace(/\.[^/.]+$/, ""); // Remove the extension
//       const sanitizedFilename = filenameWithoutExtension.replace(
//         /[^a-zA-Z0-9]/g,
//         ""
//       );
//       const sanitizedFileNameWithExtension = `${Date.now()}${sanitizedFilename}.${extension}`; // Concatenate with the extension
//       cb(null, sanitizedFileNameWithExtension);
//     },
//   }),
//   fileFilter: fileFilter,
// });

const fileFilter = (req, file, cb) => {
  //   const ext = file.originalname.split(".").pop().toLowerCase();
  //   if (allowedExtensions.includes(ext)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Invalid file type. Only image files are allowed."));
  //   }
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("Only image files are allowed!"), false);
};

const uploadToS3 = async (buffer, originalName) => {
  const extension = originalName.split(".").pop();
  const filenameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedFilename = filenameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ""
  );
  const sanitizedFileNameWithExtension = `${Date.now()}${sanitizedFilename}.${extension}`;

  const params = {
    Bucket: bucketName,
    Key: sanitizedFileNameWithExtension,
    Body: buffer,
    ContentType: `image/${extension}`,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    const location = `https://${bucketName}.s3.${region}.amazonaws.com/${sanitizedFileNameWithExtension}`;
    return { ...data, Key: params.Key, Location: location };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const customStorage = {
  _handleFile: (req, file, cb) => {
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const mimeType = file.mimetype;

      try {
        let processedBuffer = buffer;
        if (mimeType.startsWith("image/")) {
          const image = sharp(buffer);
          if (mimeType === "image/jpeg" || mimeType === "image/jpg")
            processedBuffer = await image.jpeg({ quality: 60 }).toBuffer();
          else if (mimeType === "image/png")
            processedBuffer = await image.png({ quality: 60 }).toBuffer();
          else if (mimeType === "image/webp")
            processedBuffer = await image.webp({ quality: 60 }).toBuffer();
          else if (mimeType === "image/gif")
            processedBuffer = await image.gif({ quality: 60 }).toBuffer();
        }

        const result = await uploadToS3(processedBuffer, file.originalname);
        cb(null, { key: result.Key, location: result.Location });
      } catch (err) {
        cb(err);
      }
    });
  },
  _removeFile: (req, file, cb) => cb(null),
};

const upload = multer({
  storage: customStorage,
  fileFilter: fileFilter,
});

const deleteImage = async (key) => {
  if (key) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await s3Client.send(command);
      console.log(`Deleted file: ${key}`);
    } catch (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
  }
};

module.exports = { upload, deleteImage };
