const JWT = require('jsonwebtoken')

const jwtAuth = (req,res,next)=>{
    const token = req.cookies.token || null;

    if(!token){
        return res.status(400).json({
            success: false,
            message: 'not found'
        })
    }
    try{
        const payload = JWT.verify(token,process.env.SECRET_TOKEN);
        req.user = {id: payload.id, email: payload.email};
    }catch(e){
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
    next()
}
module.exports = jwtAuth