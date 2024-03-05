import express from 'express';
import { test, update, remove, signout, getusers, commentate } from '../controllers/user.controller.js'
import { authenticate } from '../utils/authenticate.js';

const router = express.Router()

router.get("/test", test);
router.put("/update/:userId", authenticate, update);
router.delete("/remove/:userId", authenticate, remove);
router.post("/signout", signout);
router.get("/getusers", authenticate, getusers);
router.get("/:userId", commentate);

export default router;