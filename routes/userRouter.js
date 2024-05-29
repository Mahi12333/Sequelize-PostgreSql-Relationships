import express from 'express';
import {signUp,login} from '../controllers/userController.js';

console.log("signUp", signUp)
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/login', login)


export default router;