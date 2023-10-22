import { BaseController } from './BaseController';
import { Taxi } from '../models/Taxi';
import { Request, Response, NextFunction } from 'express';
import { LocationResponseDTO } from '../types/Responses';

class DriversController extends BaseController {
    getDriverLocationsByDay = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { driverName, day } = req.params;
        const startTimestamp = new Date(day).getTime();
        const endTimestamp = new Date(day).setHours(23, 59, 59, 999);

        try {
            const locations: LocationResponseDTO[] = await Taxi.aggregate([
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
        const { locationName, keyword } = req.body;

        try {
            const driversList = await Taxi.aggregate([
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
            return this.responseService(res).withSuccess('Success', 200, { drivers: [...new Set(drivers)] });
        } catch (error) {
            next(error);
        }
    }

    deleteDriverData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { driverName } = req.params;
        const { startTimestamp, endTimestamp } = req.body; // optional for time range

        const filter: any = { driver: driverName };

        if (startTimestamp && endTimestamp) {
            filter.timestamp = { $gte: startTimestamp, $lte: endTimestamp };
        }

        try {
            await Taxi.deleteMany(filter);
            return this.responseService(res).withSuccess('Success', 201);
        } catch (error) {
            next(error);
        }
    }

    getNearbyDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { coordinates, radius, timePeriod } = req.body;

        try {
            const driversList = await Taxi.aggregate([
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
            return this.responseService(res).withSuccess('Success', 200, { drivers: [...new Set(drivers)] });
        } catch (error) {
            next(error);
        }
    }
}

export const driversController = new DriversController()