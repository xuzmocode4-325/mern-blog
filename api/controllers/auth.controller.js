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
            return next(errorHandler(400, "Invalid Sign In Credentials"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword)  {
            return next(errorHandler(400, "Invalid Sign In Credentials"))
        }

        const token = jwt.sign(
            {id: validUser._id}, process.env.JWT_SECRET
        );

        const {password: pass, ...rest} = validUser._doc

        res.status(200).cookie('access_token', token, {
            httpOnly: 'true'}
        ).json(rest)

    }catch (error){
        next(error)
    }
};

export const google = async (req, res, next) => {

    const {name, email, avatar} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(existingUser){
            const token = jwt.sign(
                {id: existingUser._id}, process.env.JWT_SECRET
            );

            const {password, ...rest} = existingUser._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: 'true'}
            ).json(rest)

        } else {
            const generatedPassword = (
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8)
                );
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 12)
            
            const nicknamify = (input) => {
                const randomSuffix = Math.random().toString(9).slice(-4) 
                const nickname = input.toLowerCase().split(" ").join("") + randomSuffix
                return nickname
            }

            const nickname = nicknamify(name)

            const newUser = new User({
              username: nickname,
              email,
              password: hashedPassword,
              avatar,
            });

            console.log(newUser)

            await newUser.save()

            const token = jwt.sign(
                {id: newUser._id}, process.env.JWT_SECRET
            );

            const {password, ...rest} = newUser._doc

            res.status(200).cookie('access_token', token, {
                httpOnly: 'true'}
            ).json(rest)
        };
    } catch (error) {
        next(error)
    }
}