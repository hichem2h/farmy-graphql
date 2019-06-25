import mongoose from 'mongoose';
import { MONGO_URI } from './config';

export default function connectDatabase() {
    return new Promise((resolve, reject) => {
        mongoose.connection
          .on('error', error => reject(error))
          .on('close', () => console.error('#### Database connection closed.'))
          .once('open', () => resolve(mongoose.connections[0]));
    
        mongoose.connect(MONGO_URI, { useNewUrlParser: true, autoIndex: false});
      });
};

