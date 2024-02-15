import express from 'express';
import { test, update, remove, signout } from '../controllers/user.controller.js'
import { authenticate } from '../utils/authenticate.js';

const router = express.Router()

router.get("/test", test);
router.put("/update/:userId", authenticate, update);
router.delete("/delete/:userId", authenticate, remove);
router.post("/signout", signout);

export default router;