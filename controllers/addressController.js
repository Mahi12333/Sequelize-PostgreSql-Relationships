import Validator from 'fastest-validator';
import {Address} from '../model/index.js';


function save(req, res){
    // console.log(req.userData.userId)
    const post = {
        address: req.body.address,
        userId: req.userData.userId
    }

    // const schema = {
    //     name: {type:"string", optional: false},
    // }
    
    // const v = new Validator();
    // const validationResponse = v.validate(post, schema);

    // if(validationResponse !== true){
    //     return res.status(400).json({
    //         message: "Validation failed",
    //         errors: validationResponse
    //     });
    //   }

    
      Address.create(post).then(result => {
                res.status(201).json({
                    message: "Address created successfully",
                    post: result
                });
        })

}


export{
    save
}