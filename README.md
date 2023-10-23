# Geo-Tracking Service for Premium Taxis

This service provides RESTful APIs to track and manage the locations of premium taxi drivers.

## Features

- Fetch all location nodes a given driver visited on a specific day.
- Search for drivers who passed by a specific location or locations containing a specific keyword.
- Delete a driver's location data, either all or from a specific time period.
- (Optional) Search for drivers who were in the vicinity of a given location during a specific time period.
- Data caching for efficient and quick access to frequently requested data.

## Setup and Installation

1. **Prerequisites**
   - Node.js and npm installed.
   - MongoDB installed or a connection string to a remote MongoDB instance.
   - Redis installed for caching capabilities.

2. **Steps**
   - Clone the repository.
     ```
     git clone https://github.com/xhaferd/geo-tracking-service.git
     ```
   - Navigate to the project directory and install the dependencies.
     ```
     cd geo-tracking-service
     npm install
     ```
   - Create a `.env` file in the root directory and add your MongoDB and Redis connection strings:
     ```
     PORT=your_port
     MONGO_URI=your_mongodb_uri
     REDIS_URI=your_redis_uri
     ```
   - Start the service.
     ```
     npm start
     ```


## Setup and Installation (Docker)

### Prerequisites

- Docker
- Docker Compose

### Steps to get started:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/xhaferd/geo-tracking-service.git
   cd geo-tracking-service
   ```

2. **Build and start the services:**
   ```sh
   docker-compose up --build
   ```

   This will start all necessary services as defined in the `docker-compose.yml` file.

3. **Run the seeder:**

   After the services are up and running, you'll need to seed the database. To do this, you'll need to run the seeder inside the container.

   First, find the name or ID of your container:

   ```sh
   docker ps
   ```

   Identify your application's container from the list, and then execute the following command:

   ```sh
   docker exec -it <container-id-or-name> npm run seed
   ```

   This will seed your database with the necessary initial data.

## API Endpoints

### **GET `/drivers/:driverName/locations/:date`**
Fetch all location nodes a given driver visited on a specific day.

### **GET `/drivers/locations/search`**
Search for drivers who passed by a specific location or locations containing a keyword.

### **DELETE `/drivers/:driverName/locations`**
Delete a driver's location data based on a given query parameter.

### **GET `/drivers/nearby`**
(Optional) Search for drivers who were in the vicinity of a given location during a specific time period.
