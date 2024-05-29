
import express from 'express';
import {test} from '../controllers/testController.js'

const router = express.Router();

router.get("/associations", test);

export default router;