import { Response } from 'express';
import { LocationResponseDTO } from '../types/Responses';


export class ResponseService {
    response: Response;

    constructor() {
        this.response = {} as Response;
    }

    /**
     * Set the response object.
     *
     * @param response
     * @returns {ResponseService}
     */
    setResponse = (response: Response): ResponseService => {
        this.response = response;
        return this;
    };

    /**
     * Set body which will be sent via response.
     *
     * @param body
     * @param status
     * @param headers
     * @returns {*|Promise<any>}
     */
    withBody = (body: LocationResponseDTO, status = 200, headers = null): any | Promise<any> => {
        return this.response.status(status).json(body);
    };

    /**
     * Set message, data which will be sent via response with success = true.
     *
     * @param message
     * @param data
     * @param status
     * @param headers
     * @returns {*|Promise<any>}
     */
    withSuccess = (
        message: string,
        status = 200,
        data: any = null,
        headers = null
    ): any | Promise<any> => {
        return this.response.status(status).json({
            success: true,
            message,
            data,
        });
    };

    /**
     * Set message, data that will be sent via response with success = false.
     *
     * @param message
     * @param data
     * @param status
     * @param headers
     * @param errors
     * @returns {*|Promise<any>}
     */
    withError = (
        message: string,
        status = 404,
        data = null,
        headers = null,
        errors: any = null
    ): any | Promise<any> => {
        const respondData: any = {
            success: false,
            message,
            data,
        };

        if (errors) {
            respondData.errors = errors;
        }

        return this.response.status(status).json(respondData);
    };
}
