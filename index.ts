import { app } from './app';
import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server-core';

const start = async () => {
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  try {
    // await mongoose.connect(
    //   `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.sbbpk.mongodb.net:27017,cluster0-shard-00-01.sbbpk.mongodb.net:27017,cluster0-shard-00-02.sbbpk.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-bucdfc-shard-0&authSource=admin&retryWrites=true&w=majority`,
    //   { useNewUrlParser: true, useUnifiedTopology: true }
    // );
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
