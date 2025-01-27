import * as auth from './src/auth/auth.mjs';
import config from './src/config/config.mjs';
import { connectToMongoDB, getTenantModel } from "./src/db/db.mjs";
import errorHandler from "./src/errors/errorHandler.mjs";
import { Logger, requestLogger } from './src/logger/logger.mjs';
import configureCorsPolicy from "./src/middlewares/configureCorsPolicy.middleware.mjs";
import getUserModel from "./src/db/models/Users.model.mjs";
import validateRequest from "./src/middlewares/validateRequest.middleware.mjs";
import tenant from "./src/middlewares/tenant.middleware.mjs";
import setTenant from "./src/middlewares/setTenant.middleware.mjs";

export {
  auth,
  config,
  connectToMongoDB,
  errorHandler,
  Logger,
  requestLogger,
  configureCorsPolicy,
  validateRequest,
  getUserModel,
  tenant,
  setTenant,
};
