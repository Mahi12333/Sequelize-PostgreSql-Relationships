import jwt from 'jsonwebtoken';

function checkAuth(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1]; 
        //console.log(token,"lll");
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        //console.log("jjj",decodedToken);
        req.userData = decodedToken;
        next();
    }catch(e){
        return res.status(401).json({
            'message': "Invalid or expired token provided!",
            'error':e
        });
    }
}


export {
     checkAuth
}