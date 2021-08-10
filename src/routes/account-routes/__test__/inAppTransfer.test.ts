import request from 'supertest';
import { app } from '../../../../app';
import mongoose from 'mongoose';

it('returns a 401 if user is not authenticated', async () => {
  await request(app).post(`/api/account/in-app-transfer`).expect(401);
});

it('returns the account if the inAppTransfer was successful', async () => {
  const responseUser1 = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const responseUser2 = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(`/api/account/deposit`)
    //@ts-ignore
    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send({
      amount: 200,
    })
    .expect(200);

  const balanceResponse = await request(app)
    .get(`/api/account/balance/${responseUser1.body.accountId}`)
    //@ts-ignore
    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send()
    .expect(200);

  //@ts-ignore
  const accountResponse = await request(app)
    .post(`/api/account/in-app-transfer`)
    //@ts-ignore
    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send({
      amount: 50,
      beneficiaryId: responseUser2.body.accountId,
    })
    .expect(200);

  expect(accountResponse.body.balance).toEqual(
    balanceResponse.body.account.balance - 50
  );
});
