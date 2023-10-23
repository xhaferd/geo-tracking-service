import { BaseController } from './BaseController';
import { Location } from '../models/Location';
import { Request, Response, NextFunction } from 'express';
import { LocationResponseDTO } from '../types/Responses';
import { CustomError } from '../types/CustomError';

class DriversController extends BaseController {
    getDriverLocationsByDay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { driverName, day } = req.params;

            const startTimestamp = new Date(day).getTime();
            const endTimestamp = new Date(day).setHours(23, 59, 59, 999);

            if (!driverName || !day) {
                throw new CustomError('Parameters driverName and day are required', 400)
            }

            const locations: LocationResponseDTO[] = await Location.aggregate([
                {
                    $match: {
                        driver: driverName,
                        timestamp: {
                            $gte: startTimestamp,
                            $lte: endTimestamp
                        },
                        deletedAt: { $exists: false }
                    }
                },
                { $sort: { timestamp: 1 } }
            ]);

            return this.responseService(res).withSuccess('Success', 200, locations);
        } catch (error) {
            next(error);
        }
    }

    getDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { locationName, keyword } = req.body;
            if (!locationName && !keyword) {
                throw new CustomError('Parameters locationName and/or keyword are required', 400)
            }
            const driversList = await Location.aggregate([
                {
                    $match: {
                        $or: [
                            { location: locationName },
                            { location: { $regex: keyword, $options: 'i' } }
                        ],
                        deletedAt: { $exists: false }
                    }
                },
                { $group: { _id: "$driver" } },
                { $project: { driver: "$_id", _id: 0 } }
            ]);

            const drivers = driversList.map(loc => loc.driver);
            return this.responseService(res).withSuccess('Success', 200, [...new Set(drivers)]);
        } catch (error) {
            next(error);
        }
    }

    deleteDriverData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { driverName } = req.params;
            const { startTimestamp, endTimestamp } = req.body; // optional for time range

            if (!driverName) {
                throw new CustomError('Parameters driverName are required', 400)
            }

            const filter: any = { driver: driverName };

            if (startTimestamp && endTimestamp) {
                filter.timestamp = { $gte: startTimestamp, $lte: endTimestamp };
            }
            await Location.deleteMany(filter);
            return this.responseService(res).withSuccess('Success', 201);
        } catch (error) {
            next(error);
        }
    }

    getNearbyDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { coordinates, radius, timePeriod } = req.body;

            if (!coordinates || !radius || !timePeriod) {
                throw new CustomError('Parameters coordinates, radios and timePeriod are required', 400)
            }
            const driversList = await Location.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: coordinates
                        },
                        distanceField: "dist.calculated",
                        maxDistance: radius,
                        spherical: true
                    }
                },
                {
                    $match: {
                        timestamp: {
                            $gte: timePeriod.start,
                            $lte: timePeriod.end
                        },
                        deletedAt: { $exists: false }
                    }
                },
                { $group: { _id: "$driver" } },
                { $project: { driver: "$_id", _id: 0 } }
            ]);

            const drivers = driversList.map(loc => loc.driver);
            return this.responseService(res).withSuccess('Success', 200, [...new Set(drivers)]);
        } catch (error) {
            next(error);
        }
    }
}

export const driversController = new DriversController()