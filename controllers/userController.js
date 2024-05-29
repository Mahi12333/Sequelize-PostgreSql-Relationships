import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Category, Address, PostCategory, Role, Post, Comment } from '../model/index.js';
// console.log("User", User);

function signUp(req, res){
    // console.log(req.body)
    //Sign up
    User.findOne({where:{email:req.body.email}}).then(result => {
        if(result){
            res.status(409).json({
                message: "Email already exists!",
            });
        }else{
            bcryptjs.genSalt(10, function(err, salt){
                bcryptjs.hash(req.body.password, salt, function(err, hash){
                    const user = {
                        name: req.body.name,
                        email:req.body.email,
                        password: hash
                    }
                
                    User.create(user).then(result => {
                        res.status(201).json({
                            message: "User created successfully",
                        });
                    }).catch(error => {
                        console.log(error);
                        res.status(500).json({
                            message: "Something went wrong!",
                        });
                    });
                });
            });
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


function login(req, res){
    User.findOne({where:{email: req.body.email}}).then(user => {
        if(user === null){
            res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            bcryptjs.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const userId=user.id
                    const token=jwt.sign({userId},process.env.JWT_KEY, { expiresIn: '45m' })
                    res.status(200).json({
                        message: "Authentication successful!",
                        token: token
                    });
                    
                    // const token = jwt.sign({
                    //     email: user.email,
                    //     userId: user.id
                    // }, process.env.JWT_KEY, function(err, token){
                    //     res.status(200).json({
                    //         message: "Authentication successful!",
                    //         token: token
                    //     });
                    // });

                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}

export {
     signUp,
     login
} 
