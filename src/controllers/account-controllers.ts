import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '../errors';
import { Account } from '../models/account';
import { User } from '../models/user';

const getBalance = async (req: Request, res: Response) => {
  const { id } = req.params;

  const account = await Account.findById(id);

  if (!account) {
    throw new NotFoundError();
  }

  //@ts-ignore
  if (req.currentUser!.id != account.userId) {
    throw new NotAuthorizedError();
  }

  res.status(200).send({ account });
};

const deposit = async (req: Request, res: Response) => {
  const { amount } = req.body;

  const user = await User.findById(req.currentUser?.id);

  const account = await Account.findById(user!.accountId);

  account!.set({
    balance: account!.balance + parseInt(amount),
  });

  await account?.save();

  res.send(account);
};

const inAppTransfer = async (req: Request, res: Response) => {
  const { amount, beneficiaryId } = req.body;

  //withdraw money from balance
  const user = await User.findById(req.currentUser?.id);

  const account = await Account.findById(user!.accountId);

  if (account!.balance - parseInt(amount) <= 0) {
    throw new BadRequestError('You have insufficient funds');
  } else {
    account!.set({
      balance: account!.balance - parseInt(amount),
    });
  }

  //deposit money into another account with the person's account id
  const beneficiaryAccount = await Account.findById(beneficiaryId);

  beneficiaryAccount?.set({
    balance: beneficiaryAccount!.balance + parseInt(amount),
  });

  try {
    await beneficiaryAccount?.save();
  } catch (err) {
    account!.set({
      balance: account!.balance,
    });
    await account?.save();
    throw new Error('Something went wrong, your money has been reversed');
  }
  await account?.save();

  res.send(account);
};

const locationInfo = async (req: Request, res: Response) => {
  const { countryCode } = req.body;

  const getRate = () => {
    if (countryCode === 'NG') {
      return 411.57;
    } else if (countryCode === 'US') {
      return 1;
    } else if (countryCode === 'CN') {
      return 109.47;
    } else if (countryCode === 'JP') {
      return 6.46;
    } else {
      return null;
    }
  };

  if (!getRate()) {
    throw new BadRequestError('Country code is invalid');
  }

  const user = await User.findById(req.currentUser?.id);

  const account = await Account.findById(user!.accountId);

  //@ts-ignore
  account?.set({ balance: account.balance * getRate() });

  await account?.save();

  res.send(account);
};
// darius.simmons05@gmail.com

export { getBalance, deposit, inAppTransfer, locationInfo };
