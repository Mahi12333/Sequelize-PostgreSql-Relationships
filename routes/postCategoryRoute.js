import express from 'express';
import  {save} from '../controllers/postCategoryController.js';
import {checkAuth} from  '../middleware/checkAuth.js'

const router = express.Router();

router.post("/postcategory", save);

export default router;