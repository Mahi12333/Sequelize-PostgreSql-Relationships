import express from "express"

import { myfeeds, GetMyFeeds, GetMyFeedsDraft, getHomeBannerSlider, AddLikesFeeds, homeBannerSliders} from "../controllers/ramController.js";

import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { adminChecker } from "../middleware/adminMiddleware.js";


const storagefeedsimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/myfeeds');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const homebannersliderimg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/slider');
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
const upload = multer({ storage: storagefeedsimg, fileFilter: fileFilter });
const uploadslider = multer({ storage: homebannersliderimg, fileFilter: fileFilter });


const router = express.Router()


router.post('/myfeeds', upload.array('assets_banner', 1), myfeeds);
router.get('/myfeeds/active', GetMyFeeds);
router.get('/myfeeds/draft', GetMyFeedsDraft);
router.post('/slider', uploadslider.array('banner', 1), homeBannerSliders);
router.get('/slider', getHomeBannerSlider);
router.post('/likes', AddLikesFeeds);

export default router;