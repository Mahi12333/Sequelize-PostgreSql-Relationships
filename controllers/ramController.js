import asyncHandler from 'express-async-handler';
import Myfeeds from '../models/myfeedsModel.js';
import homeBannerSliderM from '../models/homebannersliderModel.js';
// import generatedToken from '../utils/generatedToken.js';
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const myfeeds = asyncHandler(async (req, res) => {
    for (const file of req.files){ 
        let filePath = file.path.replace(/\\/g, '/');   
        const user = await Myfeeds.create({
            project_name:req.body.project_name, 
            caption:req.body.caption, 
            project_type:req.body.project_type, 
            highlight:req.body.highlight, 
            link:req.body.link, 
            assets_banner:filePath
        });
    }
    res.status(201).json({ message: 'Data Submitted successfully' });    
});

const GetMyFeeds = asyncHandler(async (req, res)=>{
    const MyfeedsData = await Myfeeds.findAll({ where: {'status':'1', 'is_publish':'1'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MyfeedsData)
    {
        res.status(200).json({message: 'All Data List.', data:MyfeedsData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }

});

const GetMyFeedsDraft = asyncHandler(async (req, res)=>{
    const MyfeedsData = await Myfeeds.findAll({ where: {'status':'1', 'is_publish':'0'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MyfeedsData)
    {
        res.status(200).json({message: 'All Data List.', data:MyfeedsData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }

});
const homeBannerSlider = asyncHandler(async (req, res) => {
    for (const file of req.files){ 
        let filePath = file.path.replace(/\\/g, '/');
        console.log(file);   
        const user = await homeBannerSliderM.create({
            banner_title:req.body.banner_title, 
            images_name:file.filename,
            images_path:filePath
        });
    }
    res.status(201).json({ message: 'Slider home banner Submitted successfully' });    
});
const getHomeBannerSlider=asyncHandler(async(req, res)=>{
    const MybannserData = await homeBannerSliderM.findAll({ where: {'is_active':'1'} },{order: [['id', 'ASC']]});
    //const MyfeedsData = await Myfeeds.findAll({order: [['id', 'ASC']]});
    if(MybannserData)
    {
        res.status(200).json({message: 'All Data List.', data:MybannserData });
    }
    else{
        res.status(403).json({ message: 'data is not available' });
    }
});

export {
    myfeeds,
    GetMyFeeds,
    GetMyFeedsDraft,
    homeBannerSlider,
    getHomeBannerSlider
}