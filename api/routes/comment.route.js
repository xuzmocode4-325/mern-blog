import express  from "express";
import { authenticate } from '../utils/authenticate.js'
import  { prepend, getcomments }  from '../controllers/comment.controller.js'


const router = express.Router();

router.post('/prepend', authenticate, prepend);
router.get('/getcomments/:postId', getcomments);
export default router; 