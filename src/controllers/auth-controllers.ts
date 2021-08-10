import express, { Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';
import { Password } from '../services/password';
import { Account } from '../models/account';

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError('User already exist');
  }

  let user = User.build({ email, password });
  await user.save();
  const account = Account.build({ userId: user.id, balance: 0 });
  await account.save();

  user = user.set({ email, password, accountId: account.id });
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  // Store it on the session Object
  req.session = {
    jwt: userJwt,
  };

  res.status(201).send(user);
};

const currentuser = async (req: Request, res: Response) => {
  res.send({ currentUser: req?.currentUser || null });
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await Password.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_KEY!
  );

  // Store it on the session Object
  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(existingUser);
};

const signout = (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};

export { signup };
export { currentuser };
export { signin };
export { signout };
