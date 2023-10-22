import dotenv from 'dotenv';
dotenv.config();

export const config = {
	port: process.env.PORT || 5000,
    mongodb_uri: process.env.MONGO_URI,
    redis_uri: process.env.REDIS_URI
};