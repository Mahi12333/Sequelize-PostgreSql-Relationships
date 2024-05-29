import express from 'express';
import {commentController} from '../controllers/commentController.js';
import { checkAuth } from '../middleware/checkAuth.js';
const router = express.Router();
console.log(commentController.save)
router.post("/comment", checkAuth, commentController.save);
// router.get("/", commentController.index);
// router.get("/:id", commentController.show);
// router.patch("/:id", commentController.update);
// router.delete("/:id", commentController.destroy);


export default router;