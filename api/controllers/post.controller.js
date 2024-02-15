import errorHandler from "../utils/error.js";
import Post from '../models/post.model.js';


export const create = async (req, res, next) => {
    if (!req.user.admin) {
        return next(errorHandler(403, "Permission not granted."))
    }

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(403, "Incomplete submission."))
    }

    const slugify = (phrase) => {
        return phrase
        .trim()
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g,'')
    } 

    const slug = slugify(req.body.title)

    const newPost = new Post ({
        ...req.body, 
        slug, 
        userId: req.user.id
    }); 
    
    try {
        const savedPost = await newPost.save();
        res.status(201).json({
            success: true,
            post: savedPost
        })
    } catch (error) {
        next(error)
    }
}