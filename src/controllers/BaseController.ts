import { Request, Response } from 'express'
import { ResponseService } from '../services/ResponseService';

export abstract class BaseController {
    public resService: ResponseService;

    constructor() {
        this.resService = new ResponseService();
    }

    responseService = (response: Response = {} as Response): any => {
        return this.resService.setResponse(response);
    };

    getPagination = (request: Request): { limit: number; offset: number } => {
        const limit = request.query.size != null ? +request.query.size : 100;
        const offset = request.query.page != null ? +request.query.page * limit : 0;

        return { limit, offset };
    };
}
