import User from '../models/user.model.js';
import errorHandler from '../utils/error.js';
import bcryptjs from 'bcryptjs';


export const test = (req, res) => {
    res.json({message:"API ok."})
};

export const update = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "Unauthenticated session. You must be signed in to update credentials."))
    }

    if (req.body.password){
        if (req.body.password.length < 7) {
            return next(errorHandler(400, "Password must be atleast 7 characters long."))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 12);
    } 

    if (req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 21) {
            return next(errorHandler(400, "Username must be between 7 and 21 charcters long."))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, "Username cannot contain spaces."))
        }
        if (req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, "Username must only contain lowercase characters."));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, "Username must only contain letters and numbers."))
        }
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                emnail: req.body.email,
                avatar: req.body.avatar
            },
        }, {new: true});
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest); 
    } catch (error) {
        next(error);
    }
}

export const remove = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "Unauthenticated session. You must be signed in to delete account."))
    }
    
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("Account successfully deleted.")
    } catch (error) {
        next(error);
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({message:"Signout successful"})
    } catch (error) {
        next(error);
    }
}

export const getusers = async (req, res, next) => {
    if (!req.user.admin) {
        return next(errorHandler(403, "Unauthorized Request"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0; 
        const batch = parseInt(req.query.limit) || 10; 
        const sortOrder = req.query.sort === 'asc' ? 1 : -1;
        
        const users = await User.find()
            .sort({createdAt: sortOrder})
            .skip(startIndex)
            .limit(batch); 

        const usersDataNoPassword = users.map((user => {
            const { password, ...rest } = user._doc; 
            return rest;
        }));

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        )

        const lastMonthsUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo},
        });

        res.status(200).json({
            users: usersDataNoPassword,
            totalUsers,
            lastMonthsUsers, 
        });
        
    } catch (error) {
        next(error)
    }
}