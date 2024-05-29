import express from 'express';
import imageController from '../controllers/imageController.js';
import imageUploader  from '../helper/image-uploder.js';
import checkAuth from '../middleware/checkAuth.js';


const router = express.Router();

router.post('/upload', checkAuth.checkAuth, imageUploader.upload.single('image'), imageController.upload);

module.exports = router;