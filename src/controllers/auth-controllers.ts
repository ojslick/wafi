import express, { Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = User.build({ email, password });
  const response = await user.save();

  console.log('jwt_key-->', process.env.JWT_KEY);

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

export { signup };
