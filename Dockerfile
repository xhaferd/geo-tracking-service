# Use an official Node runtime as the parent image
FROM node:current-slim as builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json, package-lock.json, tsconfig.json, and source code
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src

# Install all dependencies and build
RUN npm install
RUN npm run build

# ---- Start of production stage ----
FROM node:current-slim

WORKDIR /app

# Copy only runtime dependencies and built code
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

# Specify the command to run when the container starts
CMD ["npm", "start"]
