const jwt = require('jsonwebtoken');

var checkUser = async(req,res,next) => {
    // TODO: check error handling
    const {authorization} = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            let token  = authorization.split(' ')[1]
            const {_id} = jwt.verify(token,process.env.SECRET_KEY)
            req.logInid = _id;
            next();
        }catch(error){
            return res.status(401).json({  message:'Unauthorized User!!'})
        }
    } else {
        return res.status(400).json({  message:'User have no token!!!'})
    }
}

module.exports = checkUser