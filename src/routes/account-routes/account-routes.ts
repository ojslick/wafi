import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  deposit,
  getBalance,
  inAppTransfer,
} from '../../controllers/account-controllers';
import { currentuser } from '../../controllers/auth-controllers';
import { requireAuth, validateRequest } from '../../middlewares';

const router = express.Router();

router.get('/balance/:id', requireAuth, getBalance);

router.post(
  '/deposit',
  requireAuth,
  [body('amount').notEmpty().isNumeric().withMessage('amount must numeric')],
  validateRequest,
  deposit
);

router.post(
  '/in-app-transfer',
  requireAuth,
  [
    body('amount').notEmpty().isNumeric(),
    body('beneficiaryId')
      .notEmpty()
      .withMessage('beneficiaryId must not be empty'),
  ],
  validateRequest,
  inAppTransfer
);

export { router as accountRoutes };
