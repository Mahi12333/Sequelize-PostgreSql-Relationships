import express from "express"
import { authUser,registerUser,logoutUser ,getUserProfile,updateUserProfile,refreshToken, homeBanner} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()



router.post('/' , registerUser)
router.post('/logout' , logoutUser)
router.post('/auth' , authUser)
router.post('/homebanner' , protect, homeBanner)
router.post('/refreshToken',refreshToken)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

export default router;