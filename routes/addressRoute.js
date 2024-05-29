import express from 'express';
import  {save} from '../controllers/addressController.js';
import {checkAuth} from  '../middleware/checkAuth.js'


const router = express.Router();

router.post('/address',checkAuth,save);

export default router;