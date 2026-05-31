import Router from "express";
import upload from '../middleware/multer.js';
import {uploadImage} from '../controllers/uploadController.js';

const uploadRouter = Router();

uploadRouter.route('/').post( upload.single("file"), uploadImage);

export default uploadRouter;