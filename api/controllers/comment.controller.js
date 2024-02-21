import errorHandler from '../utils/error.js'
import Comment from '../models/comment.model.js'

export const prepend = async (req, res, next) => {

    try {
        const { content, postId, userId} = req.body
        if (userId !== req.user.id) {
            return(errorHandler(403, "Authentication Error"))
        }
        const newComment = new Comment({
            content,
            postId,
            userId, 
        }); 

        await newComment.save(); 
        res.status(200).json(newComment);

    } catch (error) {
        next(error)
    }
}