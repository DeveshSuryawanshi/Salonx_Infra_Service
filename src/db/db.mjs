import mongoose from 'mongoose';
import config from '../config/config.mjs';
import { Logger }  from '../logger/logger.mjs';

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

  const tenantURI = `${config.mongoDB.uri}_${tenant}`; // Dynamic URI for tenant

  try {
    Logger.info(`Establishing connection for tenant: ${tenant}`);
    
    const connection = await mongoose.createConnection(tenantURI, mongooseOptions);
    
    // Handle connection events
    connection.on('connected', () => {
      Logger.info(`Mongoose connected for tenant: ${tenant}`);
    });
    
    // Plugin to manage database operations when connection is open
    await addPlugin();

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

// MongoDB connection open event middleware
const addPlugin = async() => {
  try {
    mongoose.connection.on('open', () => {
      Logger.info('MongoDB connection is open');
  
      // Mongoose plugin to add the updatedAt field automatically before saving
      mongoose.plugin((schema) => {
        schema.pre('save', function (next) {
          this.updatedAt = new Date();
          next();
        });
      });
    });
  } catch (error) {
    Logger.error(`Failed to connect to Plugin`, error);
    throw new Error('Failed to connect to Plugin');
  }
};

// const getTenantModel = (tenant, modelName, schema) => {
//   if (!tenant) {
//     Logger.error('Tenant identifier is required to get a tenant-specific model');
//     throw new Error('Tenant identifier missing');
//   }

//   const connection = connectionCache.get(tenant);
//   if (!connection) {
//     Logger.error(`No database connection found for tenant: ${tenant}`);
//     throw new Error(`Database connection missing for tenant: ${tenant}`);
//   }

//   if (connection.models[modelName]) {
//     return connection.models[modelName];
//   }

//   Logger.info(`Registering model '${modelName}' for tenant: ${tenant}`);
//   return connection.model(modelName, schema);
// };


export { connectToMongoDB, connectionCache };
