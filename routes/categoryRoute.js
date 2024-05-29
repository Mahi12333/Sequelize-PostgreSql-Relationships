import express from 'express';
import  {save} from '../controllers/categoryController.js';


const router = express.Router();

router.post("/category", save);

export default router;