import { app } from './app';
import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server-core';

const start = async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to mongodb');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
