import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import errorHandler from '../utils/error.js'
import jwt from 'jsonwebtoken'; 

export const signup = async (req, res, next) => {

    const {username, email, password} = req.body;
    
    if (!username || !email || !password ||
        username === "" || email === "" || password === "") {
        next(errorHandler(400, "All fields required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 12)

    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    }); 

    try {
        await newUser.save();
        res.status(201).json({message:"Signup successful"});
    } catch(error) {
        next(error)
    }
};

export const signin = async(req, res, next) => {
    const {username, password} = req.body;
    
    if (!username || !password || username === "" || password === "") {
        next(errorHandler(400, "All fields required"));
    }

    try{
        const validUser = await User.findOne({username})
        if(!validUser){
            return next(errorHandler(400, "Matching credenitials not found"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword)  {
            return next(errorHandler(400, "Matching credenitials not found"))
        }

    const token = jwt.sign(
        {id: validUser._id}, process.env.JWT_SECRET
    );

    const {password: pass, ...rest} = validUser._doc

    res.status(200).cookie('access_token', token, {
        httpOnly: 'true'}).json(rest)

    }catch (error){
        next(error)
    }
};