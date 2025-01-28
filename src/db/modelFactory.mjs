// db/modelFactory.js
import mongoose from 'mongoose';

const modelCache = new Map();

export default getModel = (tenant, modelName, schema) => {
  if (!modelCache.has(tenant)) {
    modelCache.set(tenant, {});
  }

  const tenantModels = modelCache.get(tenant);

  if (tenantModels[modelName]) {
    return tenantModels[modelName];
  }

  // Create and cache the model for the tenant
  const model = mongoose.model(`${modelName}`, schema);
  tenantModels[modelName] = model;

  return model;
};
