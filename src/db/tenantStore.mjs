// db/globalModels.js
import getModel from './modelFactory.mjs';
import userSchema from '../models/userSchema'; // Import all your schemas here

let tenant; // Store the current tenant dynamically

export const setTenant = (currentTenant) => {
  tenant = currentTenant;
};

export const User = () => {
  if (!tenant) {
    throw new Error('Tenant not set. Ensure setTenant() is called.');
  }
  return getModel(tenant, 'User', userSchema);
};

export default tenant; // Export the tenant for reference in other modules

// Similarly, export other models like Product, Order, etc.
