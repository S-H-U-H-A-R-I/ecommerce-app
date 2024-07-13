import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
    requestOTP,
    verifyOTP,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;