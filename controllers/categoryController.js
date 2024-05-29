import Validator from 'fastest-validator';
import {Category} from '../model/index.js';


function save(req, res){
    const post = {
        name: req.body.name,
    }

    const schema = {
        name: {type:"string", optional: false},
    }
    
    const v = new Validator();
    const validationResponse = v.validate(post, schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
      }
        Category.create(post).then(result => {
                res.status(201).json({
                    message: "Category created successfully",
                    post: result
                });
        })
}


export{
    save
}