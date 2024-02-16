import mongoose from "mongoose";

const postSchema = new mongoose.Schema(

    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            require: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: 'https://shawellness.com/shamagazine/wp-content/uploads/2017/06/wellness.jpg',
        }, 
        category: {
            type: String,
            default: "uncategorized",
        }, 
        slug: {
            type: String,
            required: true,
            unique: true,
        }, published :{
            type: Boolean,
            default: false, 
        }
    },  {timestamps: true}
);

const Post = mongoose.model('Post', postSchema)

export default Post; 