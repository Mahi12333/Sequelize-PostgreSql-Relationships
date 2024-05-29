import express from 'express';
import  {save, index, update, destroy ,show} from '../controllers/postController.js';
import {checkAuth} from  '../middleware/checkAuth.js'

const router = express.Router();

router.post("/post", checkAuth, save);
// router.get("/", index);
// router.get("/:id", show);
// router.patch("/:id", checkAuth, update);
// router.delete("/:id", checkAuth, destroy);

export default router;
