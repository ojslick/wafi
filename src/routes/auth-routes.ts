import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { signup } from '../controllers/auth-controllers';
import { validateRequest } from '../middlewares';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  signup
);

export { router as authRoutes };
