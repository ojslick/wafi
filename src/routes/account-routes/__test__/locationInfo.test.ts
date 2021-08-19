import request from 'supertest';
import { app } from '../../../../app';
import mongoose from 'mongoose';

it('returns a 401 if user is not authenticated', async () => {
  await request(app).post(`/api/account/locationInfo`).expect(401);
});

it('returns the account if the conversion was successful', async () => {
  const responseUser1 = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post(`/api/account/deposit`)

    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send({
      amount: 200,
    })
    .expect(200);

  const locationRes = await request(app)
    .post(`/api/account/locationInfo`)

    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send({ countryCode: 'NG' })
    .expect(200);

  const balanceResponse = await request(app)
    .get(`/api/account/balance/${responseUser1.body.accountId}`)
    //@ts-ignore
    .set('Cookie', responseUser1.headers['set-cookie'][0])
    .send()
    .expect(200);

  expect(locationRes.body.balance).toEqual(
    balanceResponse.body.account.balance
  );
});
