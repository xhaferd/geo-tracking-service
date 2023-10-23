import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { Location } from '../../models/Location';
import { driversController } from '../DriversController';
import { app } from '../../server';  // your express application entry

chai.use(chaiHttp);
const expect = chai.expect;

describe('Drivers Controller', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('getDriverLocationsByDay', () => {
        it('should fetch locations for the given driver and day', async () => {
            const driverLocations = [
                {
                    driver: 'John Doe',
                    location: 'SomePlace',
                    coordinates: [123, 456],
                    timestamp: new Date().getTime()
                },
            ];
            const stub = sinon.stub(Location, 'aggregate').returns({ exec: sinon.stub().returns(Promise.resolve(driverLocations)) } as any);

            const response = await chai.request(app).get('/drivers/John Doe/locations?day=2023-10-22');
            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal(driverLocations);
        });
    });

    describe('getDrivers', () => {
        it('should fetch unique drivers based on location or keyword', async () => {
            const driversData = [
                { driver: 'Driver1' },
                { driver: 'Driver2' },
            ];
            const stub = sinon.stub(Location, 'aggregate').returns({ exec: sinon.stub().returns(Promise.resolve(driversData)) } as any);

            const response = await chai.request(app).post('/search/drivers').send({ locationName: 'SomePlace' });
            expect(response.status).to.equal(200);
            expect(response.body.drivers).to.include.members(['Driver1', 'Driver2']);
        });
    });
});
