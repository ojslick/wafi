import request from 'supertest';
import { app } from '../../../../app';
import mongoose from 'mongoose';

it('returns a 401 if user is not authenticated', async () => {
  await request(app).post(`/api/account/deposit`).expect(401);
});

it('returns the account if the deposit was successful', async () => {
  //@ts-ignore
  const cookie = global.signup();
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const balanceResponse = await request(app)
    .get(`/api/account/balance/${response.body.accountId}`)
    //@ts-ignore
    .set('Cookie', response.headers['set-cookie'][0])
    .send()
    .expect(200);

  //@ts-ignore
  const accountResponse = await request(app)
    .post(`/api/account/deposit`)
    //@ts-ignore
    .set('Cookie', response.headers['set-cookie'][0])
    .send({
      amount: 100,
    })
    .expect(200);

  expect(accountResponse.body.balance).toEqual(
    balanceResponse.body.account.balance + 100
  );
});
