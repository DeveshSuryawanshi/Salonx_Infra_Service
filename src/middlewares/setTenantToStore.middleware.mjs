import setTenant from '../db/tenantStore.mjs';

export default setTenantToStore = (req, res, next) => {
  const tenant = req.tenant; // Extract tenant from previous middleware
  if (!tenant) {
    return res.status(400).json({ message: 'Tenant not set in the request.' });
  }
  setTenant(tenant);
  next();
};

