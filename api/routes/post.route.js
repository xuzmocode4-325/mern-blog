import express from 'express'
import { authenticate } from '../utils/authenticate.js';
import { create, search, discard } from '../controllers/post.controller.js'; 

const router = express.Router()

router.post('/create', authenticate, create);
router.get('/search', search);
router.delete(`/discard/:postId/:userId`, authenticate, discard);

export default router; 


