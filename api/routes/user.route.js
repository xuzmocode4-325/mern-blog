import express from 'express';
import { test, update } from '../controllers/user.controller.js'
import { authenticate } from '../utils/authenticate.js';

const router = express.Router()

router.get("/test", test);
router.put("/update/:userId", authenticate, update);

export default router;