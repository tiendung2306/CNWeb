// src/middleware/uploadImage.js
import multer from 'multer';

const storage = multer.memoryStorage();
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // giới hạn 5MB
});

export default uploadImage.single('image');
