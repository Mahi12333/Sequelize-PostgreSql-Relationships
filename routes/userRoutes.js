import express from "express"
import { authUser,registerUser,logoutUser ,getUserProfile,updateUserProfile,refreshToken, homeBanner, getHomeBanner, addProjectFiles, viewProjectFiles, deleteProjectFiles, activateHomeBanner} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { adminChecker } from "../middleware/adminMiddleware.js";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest;
        console.log(req.body.project_name !== undefined || file.mimetype.startsWith('image/'));
        
        if (file.mimetype.startsWith('image/')) {
            dest = 'uploads/project/images';
        } else if (file.mimetype === 'video/mp4') {
            dest = 'uploads/project/videos';
        } else {
            return cb(new Error('Invalid file type'));
        }
        if(req.body.project_name !== undefined || file.mimetype.startsWith('image/')){
            dest = 'uploads/project/homeBanner';
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
router.post('/refreshToken',refreshToken)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.post('/homebanner' , protect,  adminChecker, upload.single('images') , homeBanner)
router.get('/homebanner', getHomeBanner)
router.post('/activatehomebanner',protect,  adminChecker, activateHomeBanner)
router.post('/addProjectFiles' , protect , adminChecker, upload.array('images', 10) ,addProjectFiles)
router.post('/viewProjectFiles' , protect , adminChecker ,viewProjectFiles)
router.post('/deleteProjectFiles' , protect , adminChecker ,deleteProjectFiles)

export default router;