import express from "express"
import { authUser,registerUser,logoutUser ,getUserProfile,updateUserProfile,refreshToken, homeBanner, getHomeBanner, addProjectFiles, viewProjectFiles, deleteProjectFiles} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { adminChecker } from "../middleware/adminMiddleware.js";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest;
        console.log(req.body)
        if (file.mimetype.startsWith('image/')) {
            dest = 'uploads/project/images';
        } else if (file.mimetype === 'video/mp4') {
            dest = 'uploads/project/videos';
        } else {
            return cb(new Error('Invalid file type'));
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and MP4 files are allowed'));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router()



router.post('/' , registerUser)
router.post('/logout' , logoutUser)
router.post('/auth' , authUser)
router.post('/homebanner' , protect, homeBanner)
router.post('/refreshToken',refreshToken)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.get('/homebanner', getHomeBanner)
router.post('/addProjectFiles' , protect , adminChecker, upload.array('images', 10) ,addProjectFiles)
router.post('/viewProjectFiles' , protect , adminChecker ,viewProjectFiles)
router.post('/deleteProjectFiles' , protect , adminChecker ,deleteProjectFiles)

export default router;