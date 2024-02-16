import express from 'express'
import { authenticate } from '../utils/authenticate.js';
import { create, search } from '../controllers/post.controller.js'; 

const router = express.Router()

router.post('/create', authenticate, create)
router.get('/search', search)

export default router; 


