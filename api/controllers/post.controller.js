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

export const search = async (req, res, next) => { 
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const batch = parseInt(req.query.batch) || 9;
        const sortOrder = req.query.order === 'asc'? 1 : -1; 
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerms && { 
                $or: [
                    {title: { $regex: req.query.searchTerms, $options: 'i'}}, 
                    {content: { $regex: req.query.searchTerms, $options: 'i'}}, 
                ]
            }),
        }).sort({ updateAt: sortOrder }).skip(startIndex).limit(batch);

        const totalPosts = await Post.countDocuments()
      
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        )

        const lastMonthsPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo},
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthsPosts, 
        });

    } catch (error) {
        next(error)
    }
};

export const discard = async (req, res, next) => {
    if(!req.user.admin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Permission Error'))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post Successfully Deleted')
    } catch (error) {
        next(error); 
    }
};

export const update = async (req, res, next) => {
    if(!req.user.admin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Permission Error'))
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId, 
            {
            $set:{
                title: req.body.title,
                content: req.body.content, 
                category: req.body.category,
                image: req.body.image
                },  
            },  
            { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error); 
    }
}