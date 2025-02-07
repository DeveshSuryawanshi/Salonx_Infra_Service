// db/modelFactory.js
// import mongoose from 'mongoose';
import { connectToMongoDB } from "./db.mjs";

const modelCache = new Map();

const getModel = async(tenant, modelName, schema) => {
  if (!modelCache.has(tenant)) {
    modelCache.set(tenant, {});
  }

  const tenantModels = modelCache.get(tenant);

  if (tenantModels[modelName]) {
    return tenantModels[modelName];
  }

  // const model = mongoose.model(`${modelName}`, schema);
  const connection = await connectToMongoDB(tenant);
  const model = connection.model(modelName, schema);
  // Create and cache the model for the tenant
  tenantModels[modelName] = model;

  return model;
};

export default getModel;