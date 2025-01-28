// db/globalModels.js

let tenant; // Store the current tenant dynamically

export const setTenant = (currentTenant) => {
  tenant = currentTenant;
};

export default tenant; // Export the tenant for reference in other modules

// Similarly, export other models like Product, Order, etc.
