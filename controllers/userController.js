
import asyncHandler from 'express-async-handler'
import generatedToken from '../utils/generatedToken.js';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Material, Place, Amenity, Commission, HomeBannerSlider, HomeSchema, MyFeeds, Offer, Payment, ProjectDesignType, Project, User, ProjectAmenity } from '../models/index.js';
import fs from 'fs/promises'

















// @desc Auth user/set token
// route Post /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check the user and password match
    if (user && await bcrypt.compare(password, user.password)) {
        generatedToken(res, user.id);
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.username
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password');
    }
});


// @desc register user
// route Post /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {
        username, password, email, first_name, last_name, logo, company_name,
        address, communication, role, is_active, team_name, channel_ptn_id, contact_number
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);  // 10 rounds is generally enough, more rounds are more secure but slower
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create new user with all the fields
    const user = await User.create({
        username, password: hashedPassword, email, first_name, last_name, logo, company_name,
        address, communication, role, is_active, team_name, channel_ptn_id, contact_number
    });

    if (user) {
        const token = generatedToken(res, user.id);  // Assuming generatedToken function returns a token

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token  // Send the token as part of the response
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});



// @desc logout user
// route Post /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
})

// @desc get user profile
// route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json({
            id: user.id,
            name: user.username,
            email: user.email
        });
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }

})

// @desc update user profile
// route Put /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password
        }

        const updateUser = await user.save()

        res.json({
            id: updateUser.id,
            name: updateUser.username,
            email: updateUser.email
        })
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
    res.status(200).json({ message: 'Update User Profile' })
})


const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        generatedToken(res, decoded.userId);  // Reissue both tokens
        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
})


const homeBanner = asyncHandler(async (req, res) => {
    console.log(req.file);
    const {
        project_name, redirect_link, is_active, created_at
    } = req.body;

    const homebannerDetails = await HomeSchema.create({
        project_name, redirect_link, banner_img: req.file.path, is_active, created_at
    });
    if (homebannerDetails) {
        res.status(201).json(homebannerDetails);
    } else {
        res.status(400);
        throw new Error('Invalid data');
    }
})

const getHomeBanner = asyncHandler(async (req, res) => {
    const getallHomeBanner = await HomeSchema.findAll({ where: { is_active: '1' } });
    if (getallHomeBanner) {
        res.status(200).json({ data: getallHomeBanner, message: 'banner images load succssefully' });
    }
    else {
        res.status(403).json({ message: 'data is not available' });
    }

})

const addProjectFiles = asyncHandler(async (req, res) => {
    for (const file of req.files) {
        await ProjectDesignType.create({
            project_id: req.body.project_id,
            file_name: file.originalname,
            project_design_type: req.body.project_design_type,
            file_path: file.path
        })
    }
    res.status(201).json({ message: 'File uploaded successfully' });
})
const viewProjectFiles = asyncHandler(async (req, res) => {
    const { project_id, project_design_type } = req.body
    const projectFiles = await ProjectDesignType.findAll({
        where: {
            project_id,
            project_design_type
        }
    });
    res.status(200).json(projectFiles);
})
const deleteProjectFiles = asyncHandler(async (req, res) => {

    const { id } = req.body;

    const projectFile = await ProjectDesignType.findByPk(id);
    if (!projectFile) {
        return res.status(404).json({ message: 'No project files found with the provided ID.' })
    }

    let filePath = projectFile.file_path;
    filePath = filePath.replace(/\\/g, '/');

    await ProjectDesignType.destroy({
        where: {
            id: id
        }
    })

    // Delete the file from the file system
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (fileExists) {
        // Delete the file from the file system
        await fs.unlink(filePath);
    } else {
        console.warn('File does not exist:', filePath);
    }
    res.status(200).json({ message: 'Project file and associated file deleted successfully.' });
})

const activateHomeBanner = asyncHandler(async (req, res) => {
    const home = await HomeSchema.findByPk(req.body.id)
    console.log(home);
    if (!home) {
        return res.status(404).json({ message: 'Home Banner not found' });
    }

    await home.update({ is_active: '1' });
    await home.save();

    return res.status(200).json({ message: 'this Banner activated in live website' });
})

const AddProject = asyncHandler(async (req, res) => {
    let project;
    const data = req.body;
    if(data.step === '0'){
       
        if(data.project_id){
            let existingProject = await Project.findOne({ where: { id: data?.project_id } });
            if (existingProject) {
                // Update existing project with filled fields
                const filledFields = Object.entries(data).filter(([key,value]) => value !== '')
                .reduce((obj, [key ,value]) => {
                    obj[key] = value;
                    return obj
                },{})
                if(data.images !== ''){
                    filledFields.project_banner = req?.file?.path;
                }
                await existingProject.update(filledFields);

                project = await Project.findAll({
                    where: {
                        id: data.project_id
                    },
                    include: [
                        {
                            model: Place,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Material,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: ProjectDesignType,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Payment,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Offer,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: Commission,
                            where: {
                                project_id: data.project_id
                            },
                            required: false
                        },
                        {
                            model: ProjectAmenity,
                            attributes: ['is_check'], 
                            where: { project_id: data.project_id },
                            required:false,
                            include: [
                                {
                                    model: Amenity, 
                                    attributes: ['id', 'name', 'images'],
                                    required: false
                                }
                            ]
                        }
                    ]
                })


                return res.status(200).json(project);
            }
        }
        else {
            console.log(data);
            // Create new project
            if(data.images === ''){
                data.project_banner = ''
            }
            else {
                data.project_banner = req?.file?.path
            }
            data.user_id = req.user.id
            data.is_publish = '0'
            project = await Project.create(data);
            return res.status(201).json(project);
        }
       
       
    }
    if (data.step === '1') {
        // Step 1 fields (only required fields)
        const step1Data = {
            project_name: data.project_name,
            developer_name: data.developer_name,
            community_name: data.community_name,
            location: data.location,
            project_type: data.project_type,
            description: data.description,
            project_banner: req.file.path, // Assuming this is required for step 1
            step: data.step,
            user_id: req.user.id,
            is_publish: '0',
            commission: '',
            amenities: '',
            service_charge: '',
            area_starts: '',
            bedroom: '',
            estimation: '',
            starting_price: ''
        };
        project = await Project.create(step1Data);
        return res.status(201).json(project);
    }
    else if (data.step === '2') {
        // Step 2 fields (additional fields required)
        const step2Data = {
            starting_price: data.starting_price,
            estimation: data.estimation,
            bedroom: data.bedroom,
            area_starts: data.area_starts,
            service_charge: data.service_charge,
            step: data.step
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new Error('Project not found');
        }
        await project.update(step2Data);
        return res.status(201).json(project);
    }
    else if (data.step === '3' || data.step === '4') {
        const stepData = {
            step: data.step,
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new Error('Project not found');
        }
        await project.update(stepData);
        return res.status(201).json(project);
    }
    else if (data.step === '5') {
        const step5Data = {
            step: data.step,
            commission: data.commission
        };
        // Find the project by project_id and update it with step 2 data
        project = await Project.findOne({ where: { id: data.project_id } });
        if (!project) {
            throw new Error('Project not found');
        }
        await project.update(step5Data);
        return res.status(201).json(project);
    }
    else if (data.step === '6') {
        project = await Project.findOne({ where: { id: data.project_id } });
        await project.update({step:data.step});
        project = await Project.findAll({
            where: {
                id: data.project_id
            },
            include: [
                {
                    model: Place,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Material,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: ProjectDesignType,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Payment,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Offer,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: Commission,
                    where: {
                        project_id: data.project_id
                    },
                    required: false
                },
                {
                    model: ProjectAmenity,
                    attributes: ['is_check'], 
                    where: { project_id: data.project_id }, 
                    include: [
                        {
                            model: Amenity, 
                            attributes: ['id', 'name', 'images'],
                            required: false
                        }
                    ]
                }
            ]
        })
        return res.status(201).json(project);
        
    }
    else if(data.step === '7'){
        project = await Project.findOne({ where: { id: data.project_id } });
        await project.update({step:data.step,is_publish:"1"});
        return res.status(200).json({message:'Project are successfully Publish'}) 
    }
    

})


const NearbyPlaces = asyncHandler(async (req, res) => {
    const data = req.body

    const insertPlacesObj = {
        project_id: data.project_id,
        place: data.place,
        place_time: data.place_time
    }

    const placeData = await Place.create(insertPlacesObj)
    if (!placeData) {
        return res.status(404).json({ message: 'Place is not found' })
    }

    return res.status(201).json({ message: 'Nearby Place successfully add your project' })
})

const AddAmenitiesGlobal = asyncHandler(async (req, res) => {
    const data = req.body

    const insertAmenitiesObj = {
        name: data.name,
        images: data.images,
    }

    const amentiesData = await Amenity.create(insertAmenitiesObj)
    if (!amentiesData) {
        return res.status(404).json({ message: 'amenities is not found' })
    }

    return res.status(201).json({ message: 'amenities successfully add your project' })
})
const ViewAmenities = asyncHandler(async (req, res) => {
    const { id, is_check, project_id } = req.body;

    if (id !== undefined) {
        const amenity = await Amenity.findByPk(id);

        if (!amenity) {
            return res.status(404).json({ message: 'Amenity not found' });
        }
        // Check if a ProjectAmenity entry exists for the provided amenityId and projectId
        let existingProjectAmenity = await ProjectAmenity.findOne({
            where: {
                AmenityId: id,
                project_id: project_id
            }
        });

        // If a ProjectAmenity entry exists, toggle the value of is_check
        if (existingProjectAmenity) {
            console.log('ok zaid');
            const isCheck = existingProjectAmenity.is_check == 'true' ? 'false' : 'true'
            console.log(existingProjectAmenity.is_check);
            await existingProjectAmenity.update({ is_check: isCheck })
        }
        else {
            await ProjectAmenity.create({
                AmenityId: id,
                project_id: project_id,
                is_check: 'true' // Assuming is_check should be true for new entries

            });
        }
    }

    // If no ProjectAmenity entry exists, create a new one with is_check set to true

    const amenities = await Amenity.findAll({

        include: [{
            model: ProjectAmenity,
            attributes: ['is_check'],
            required: false,
            where: { project_id: project_id }
        }]
    })

    const response = amenities.map(amenity => {
        const amenityData = amenity.toJSON();
        if (!amenityData.ProjectAmenities || amenityData.ProjectAmenities.length === 0) {
            amenityData.ProjectAmenities = [{ is_check: 'false' }];
        }
        return amenityData;
    });

    return res.status(201).json(response);
})

const UploadMarketingMaterial = asyncHandler(async (req, res) => {
    const { file_type, project_id } = req.body

    const marketingMaterial = await Material.create({
        project_id,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type
    })
    return res.status(201).json({ message: 'documents uploaded', data: marketingMaterial })
})

const ProjectOffers = asyncHandler(async (req, res) => {
    const { project_id, title, description } = req.body;

    const projectOfferInsert = await Offer.create({
        project_id,
        title,
        description
    })
    return res.status(201).json({ message: 'offer inserted', data: projectOfferInsert })
})

const ProjectPayments = asyncHandler(async (req, res) => {
    const { project_id, installment, notes } = req.body;

    const projectPaymentsInsert = await Payment.create({
        project_id,
        installment,
        notes
    })
    return res.status(201).json({ message: 'Payments inserted', data: projectPaymentsInsert })
})
const ProjectCommision = asyncHandler(async (req, res) => {
    const { project_id, commission, description } = req.body;

    const projectCommisionInsert = await Commission.create({
        project_id,
        commission,
        description
    })
    return res.status(201).json({ message: 'Commision inserted', data: projectCommisionInsert })
})


export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    refreshToken,
    homeBanner,
    getHomeBanner,
    addProjectFiles,
    viewProjectFiles,
    deleteProjectFiles,
    activateHomeBanner,
    AddProject,
    NearbyPlaces,
    AddAmenitiesGlobal,
    ViewAmenities,
    UploadMarketingMaterial,
    ProjectOffers,
    ProjectPayments,
    ProjectCommision
}