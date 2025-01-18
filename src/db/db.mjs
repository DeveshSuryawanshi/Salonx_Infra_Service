import mongoose from 'mongoose';
import config from '../config.mjs';
import { Logger } from '../logger.mjs';

const connectionCache = new Map(); // Advanced caching using Map

// Configure Mongoose options for secure and optimized connections
const mongooseOptions = {
  maxPoolSize: 50, // Maximum number of connections in the pool
  minPoolSize: 5,  // Minimum number of connections in the pool
  connectTimeoutMS: 10000, // Time to wait before timing out a connection
  serverSelectionTimeoutMS: 5000, // Time to wait for server selection
  socketTimeoutMS: 45000, // Close sockets after this time
  tls: true, // Enable TLS/SSL
};

// Create a connection function with tenant-specific logic
const connectToMongoDB = async (tenant) => {
  if (!tenant) {
    Logger.error('Tenant identifier is required to establish a database connection');
    throw new Error('Tenant identifier missing');
  }

  // Check if a connection for the tenant already exists in the cache
  if (connectionCache.has(tenant)) {
    Logger.info(`Reusing existing connection for tenant: ${tenant}`);
    return connectionCache.get(tenant);
  }

  const tenantURI = `${config.mongoDB.uri}/${tenant}`; // Dynamic URI for tenant

  try {
    Logger.info(`Establishing connection for tenant: ${tenant}`);
    
    const connection = await mongoose.createConnection(tenantURI, mongooseOptions);
    
    // Handle connection events
    connection.on('connected', () => {
      Logger.info(`Mongoose connected for tenant: ${tenant}`);
    });

    connection.on('error', (err) => {
      Logger.error(`Mongoose connection error for tenant ${tenant}: ${err.message}`);
    });

    connection.on('disconnected', () => {
      Logger.info(`Mongoose disconnected for tenant: ${tenant}`);
      connectionCache.delete(tenant); // Remove from cache on disconnection
    });

    // Add the connection to the cache
    connectionCache.set(tenant, connection);

    return connection;
  } catch (error) {
    Logger.error(`Error connecting to MongoDB for tenant ${tenant}:`, error);
    throw new Error('Failed to connect to the database');
  }
};

// Cleanup connections on application termination
process.on('SIGINT', async () => {
  Logger.info('Closing all database connections');
  const connectionClosePromises = Array.from(connectionCache.values()).map((conn) => conn.close());
  await Promise.all(connectionClosePromises);
  Logger.info('All database connections closed');
  process.exit(0);
});

export default connectToMongoDB;
