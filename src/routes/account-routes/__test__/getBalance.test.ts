import request from 'supertest';
import { app } from '../../../../app';
import mongoose from 'mongoose';

it('returns a 404 if the account is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/account/${id}`).expect(404);
});

it('returns the account if the account is found', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const accountResponse = await request(app)
    .get(`/api/account/balance/${response.body.accountId}`)
    //@ts-ignore
    .set('Cookie', response.headers['set-cookie'][0])
    .send()
    .expect(200);

  expect(accountResponse.body.userId).toEqual(response.body.userId);
});
