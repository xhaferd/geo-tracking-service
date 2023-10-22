import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '../config'
import { CustomError } from '../types/CustomError';
import { Taxi } from '../models/Taxi'

const DRIVERS = ["John", "Jane", "Doe", "Alice", "Bob"];
const LOCATIONS = ["LocationA", "LocationB", "LocationC", "LocationD", "LocationE", "LocationF"];

function getRandomItem(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomCoordinates() {
    return [Math.random() * 180 - 90, Math.random() * 360 - 180];
}

function generateTaxiData() {
    return {
        driver: getRandomItem(DRIVERS),
        location: getRandomItem(LOCATIONS),
        coordinates: getRandomCoordinates(),
        timestamp: Date.now() - Math.floor(Math.random() * 1000000)
    };
}

async function populateDatabase() {
    for (let i = 0; i < 100; i++) {
        const taxiData = generateTaxiData();
        const taxi = new Taxi(taxiData);
        await taxi.save();
    }
    console.log("Database populated with sample data!");
}

if (!config.mongodb_uri) {
    throw new CustomError('Please provide a URI for connection to Database', 500)
}

// Connect to MongoDB
mongoose.connect(config.mongodb_uri, { useUnifiedTopology: true } as ConnectOptions)
    .then(async () => {
        console.log("Connected to MongoDB!");
        await populateDatabase();
        mongoose.disconnect();
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });
