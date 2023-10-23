import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '../config';
import { CustomError } from '../types/CustomError';

export const connect = () => {
    if (!config.mongodb_uri) {
        throw new CustomError('Please provide a URI for connection to Database', 500)
    }

    mongoose.connect(config.mongodb_uri, { useUnifiedTopology: true } as ConnectOptions)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
        });
}