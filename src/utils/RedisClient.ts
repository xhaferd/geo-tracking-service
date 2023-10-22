import redis from 'redis';
import { promisify } from 'util';
import { config } from '../config'
import { CustomError } from '../types/CustomError';

if (!config.redis_uri) {
    throw new CustomError('Please provide a URI for connection to Redis', 500)
}

const client = redis.createClient({
    url: config.redis_uri,
});

// Handling Redis connection events
client.on('connect', () => {
    console.log('Connected to Redis.');
});
client.on('error', (error) => {
    console.error('Redis error:', error);
});

// Convert callback-based functions to promise-based ones
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

const generateLocationKey = (id: string) => `taxi:${id}`;

export { getAsync, setAsync, delAsync, generateLocationKey };
