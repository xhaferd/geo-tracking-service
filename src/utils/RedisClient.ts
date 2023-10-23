import { RedisClientType, createClient } from 'redis';
import { promisify } from 'util';
import { config } from '../config'
import { CustomError } from '../types/CustomError';

if (!config.redis_uri) {
    throw new CustomError('Please provide a URI for connection to Redis', 500)
}

let redisClient: RedisClientType;

(async () => {
    redisClient = createClient({ url: config.redis_uri, });

    redisClient.on("error", (error) => console.error(`Redis error : ${error}`));

    // Handling Redis connection events
    redisClient.on('connect', () => {
        console.log('Connected to Redis.');
    });

    await redisClient.connect();
})();

const generateLocationKey = (id: string) => `location:${id}`;

export { redisClient, generateLocationKey };

