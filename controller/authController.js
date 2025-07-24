const userModel = require("../models/userschema");
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'All field is required'
        })
    }
    const validemail = emailValidator.validate(email);
    if (!validemail) {
        return res.status(400).json({
            success: false,
            message: 'Please enter valid email'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'password and confirm password not match'
        })
    }
    try {
        const userInfo = userModel(req.body)
        const result = await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists of this email id'
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}
const signin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fieds are required'
        })
    }
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user || !await bcrypt.compare(password, user.password) ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        };

        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}
const getuser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message
        })
    }
}
const logout = async (req,res)=>{
    
    try{
        const cookieOption = {
        expires: new Date(),
        httpOnly: true
    }
    res.cookie("token",null,cookieOption);
    res.status(200).json({
        success: true,
        message: "Logout"
    })
    }catch(e){
     res.status(400).json({
        success: false,
        message: e.message
    })
    }
}

module.exports = { signup, signin, getuser,logout }