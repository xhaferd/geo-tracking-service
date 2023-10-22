import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/CustomError';
import { ResponseService } from '../services/ResponseService';
import { Logger } from '../utils/logger';

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
export const errorHandler = (
    err: TypeError | CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let customError = err;
    const responseService = new ResponseService();

    if (!(err instanceof CustomError)) {
        Logger.error(err.message);
        customError = new CustomError('Something went wrong', 501);
    }

    // we are not using the next function to prevent from triggering
    // the default error-handler. However, make sure you are sending a
    // response to client to prevent memory leaks in case you decide to
    // NOT use, like in this example, the NextFunction .i.e., next(new Error())
    // res.status((customError as CustomError).status).send(customError);
    return responseService
        .setResponse(res)
        .withError(
            customError.message,
            (customError as CustomError).status,
            (customError as CustomError).additionalInfo
        );
};