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
  //withdraw money from balance
  //deposit money into another account with the person's account id
  const { amount, beneficiaryId } = req.body;

  const user = await User.findById(req.currentUser?.id);

  const account = await Account.findById(user!.accountId);

  if (account!.balance - parseInt(amount) <= 0) {
    throw new BadRequestError('You have insufficient funds');
  } else {
    account!.set({
      balance: account!.balance - parseInt(amount),
    });
  }

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
    throw new Error('Something went wrong, your money has been reversed');
  }
  await account?.save();

  res.send(account);
};

export { getBalance, deposit, inAppTransfer };
