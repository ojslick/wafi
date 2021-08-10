import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  currentuser,
  signin,
  signout,
  signup,
} from '../../controllers/auth-controllers';
import { currentUser, validateRequest } from '../../middlewares';

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

router.get('/currentuser', currentUser, currentuser);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  signin
);

router.post('/signout', signout);

export { router as authRoutes };
