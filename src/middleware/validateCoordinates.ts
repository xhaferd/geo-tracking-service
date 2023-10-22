import { Request, Response, NextFunction } from 'express';

export const validateData = (req: Request, res: Response, next: NextFunction) => {
    const { driver, location, coordinates } = req.body;

    // Check for empty fields
    if (!driver || !location || !coordinates || coordinates.length !== 2) {
        return res.status(400).send('Incomplete data provided.');
    }

    // Check for [0, 0] coordinates
    if (coordinates[0] === 0 && coordinates[1] === 0) {
        return res.status(400).send('Invalid coordinates provided.');
    }

    next();
};
