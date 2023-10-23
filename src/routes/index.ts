import express from 'express';
import { driversController } from '../controllers/DriversController';
import { cacheMiddleware } from '../middleware/cacheMiddleware';

const router = express.Router();

router.get('/drivers/:driverName/locations/:day', cacheMiddleware, driversController.getDriverLocationsByDay);
router.post('/search/drivers', cacheMiddleware, driversController.getDrivers);
router.delete('/drivers/:driverName/locations', driversController.deleteDriverData);
router.post('/search/nearby-drivers', cacheMiddleware, driversController.getNearbyDrivers);

export = router