import Validator from 'fastest-validator';
import {Category, Post, PostCategory} from '../model/index.js';


async function save(req, res){
    // console.log(req.body);
    const post = {
        postId: req.body.post_id,
        categoryId: req.body.category_id,
    }

    const schema = {
        postId: {type: "number", optional: false},
        categoryId: {type: "number", optional: false}
    }
      
    const v = new Validator();
    const validationResponse = v.validate(post, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    if( (req.body.post_id) && (req.body.category_id)){
        const categoryId=await Category.findByPk(req.body.category_id);
        const postId=await Post.findByPk(req.body.post_id);
        if(categoryId && postId){
            //console.log(categoryId , postId)
            PostCategory.create(post).then(result => {
                res.status(201).json({
                    message: "PostCategory created successfully",
                    post: result
                });
            }).catch(error => {
                res.status(500).json({
                    message: "Something went wrong",
                    error: error
                });
            });
        }
    }


//     const categoryId= Category.findByPk(req.body.category_id);
//     const postId= Post.findByPk(req.body.post_id);

//    Promise.all[categoryId,postId].then(result => {
//         if(result !== null){
//             PostCategory.create(post).then(result => {
//                 res.status(201).json({
//                     message: "PostCatrgory created successfully",
//                     post: result
//                 });
//             }).catch(error => {
//                 res.status(500).json({
//                     message: "Something went wrong",
//                     error: error
//                 });
//             });
//         }else{
//             res.status(400).json({
//                 message: "Invalid Category ID"
//             });
//         }
//     });
        
}


export {
    save
}