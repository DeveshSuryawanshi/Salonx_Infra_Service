import { setTenant } from '../db/globalModels';

export default setTenant = (req, res, next) => {
  const tenant = req.tenant; // Extract tenant from previous middleware
  if (!tenant) {
    return res.status(400).json({ message: 'Tenant not set in the request.' });
  }
  setTenant(tenant);
  next();
};
