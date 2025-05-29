// src/controllers/upload.controller.js
import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded!' });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads', // tên folder trên Cloudinary
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    res.status(200).json({
      message: 'Upload thành công!',
      url: result.secure_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload thất bại', error: err });
  }
};
