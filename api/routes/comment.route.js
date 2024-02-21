import express  from "express";
import { authenticate } from '../utils/authenticate.js'
import  { prepend }  from '../controllers/comment.controller.js'


const router = express.Router();

router.post('/prepend', authenticate, prepend);

export default router; 