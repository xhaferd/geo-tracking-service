import { NextFunction, Request, Response } from 'express';
import { getAsync, setAsync } from '../utils/RedisClient';

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.originalUrl}`;

    try {
        const cachedData = await getAsync(key);

        if (cachedData) {
            console.log('Serving from cache');
            return res.send(JSON.parse(cachedData));
        }

        // If no cache is found, use a custom res.send to cache the response before sending it
        const send = res.send;
        res.send = function (body) {
            setAsync(key, body, 'EX', 3600);  // Cache it for 1 hour (3600 seconds)
            return send.call(this, body);
        }

        next();
    } catch (error) {
        next(error);
    }
};
