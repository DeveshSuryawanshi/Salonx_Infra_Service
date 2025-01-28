import { tenant } from "../tenantStore.mjs";
import getModel from "../modelFactory.mjs"
import userSchema from "../schemas/users.schema.mjs";

export const User = () => {
  if (!tenant) {
    throw new Error('Tenant not set. Ensure setTenant() is called.');
  }
  return getModel(tenant, 'User', userSchema);
};