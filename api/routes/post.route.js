import express from 'express'
import { authenticate } from '../utils/authenticate.js';
import { create } from '../controllers/post.controller.js'; 

const router = express.Router()

router.post('/create', authenticate, create)

export default router; 


