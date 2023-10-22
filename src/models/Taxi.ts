import mongoose from 'mongoose';
import softDelete from 'mongoose-delete';
import { delAsync, generateLocationKey } from '../utils/RedisClient';

const coordsValidator = (value: number[]) => {
    return !(value[0] === 0 && value[1] === 0); // reject [0, 0] coordinates
}

const taxiSchema = new mongoose.Schema({
    driver: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
        type: [Number],
        required: true,
        validate: [coordsValidator, 'Invalid coordinates']
    },
    timestamp: { type: Number, required: true },
    deletedAt: { type: Number, default: null }
});

// Apply soft delete plugin
taxiSchema.plugin(softDelete, { 
    deletedAt: true, // This will add a 'deletedAt' field, if true it will store the timestamp of the deletion 
    overrideMethods: 'all', // Override methods to include "deleted" documents 
});

// After a document is saved
taxiSchema.post('save', function (doc) {
    console.log(`Document with id ${doc._id} was saved.`);
    const key = generateLocationKey(doc._id.toString());
    delAsync(key);
});

// After a document is removed (using deleteOne)
taxiSchema.post('deleteOne', function(doc) {
    console.log(`Document with id ${doc._id} was deleted.`);
    const key = generateLocationKey(doc._id.toString());
    delAsync(key);
});

// After a document is soft-deleted using deleteMany
taxiSchema.post('deleteMany', function() {
    delAsync('taxi:*');
});


// After an update operation
taxiSchema.post('findOneAndUpdate', function (doc) {
    if (!doc) return;  // No document found and updated, so nothing to do.
    console.log(`Document with id ${doc._id} was updated.`);
    const key = generateLocationKey(doc._id.toString());
    delAsync(key);
});

// After a document is updated using updateMany
taxiSchema.post('updateMany', function() {
    delAsync('taxi:*');
});


export const Taxi = mongoose.model('Location', taxiSchema);