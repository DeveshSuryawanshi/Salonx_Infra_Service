// db/globalModels.js

let tenant; // Store the current tenant dynamically

const setTenant = (currentTenant) => {
  tenant = currentTenant;
};

export { tenant, setTenant }; // Export the tenant for reference in other modules

// Similarly, export other models like Product, Order, etc.
