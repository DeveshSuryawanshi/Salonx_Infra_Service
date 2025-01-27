import { connectionCache } from "../db/db.mjs";

export default tenant = (req, res, next) => {
  const tenant = req.headers['x-tenant-id'];

  if (!tenant) {
    return res.status(400).json({ message: 'Tenant ID is missing in the request headers.' });
  }

  if (!connectionCache.has(tenant)) {
    return res.status(500).json({ message: `No database connection found for tenant: ${tenant}` });
  }

  // Attach tenant and database connection to the request
  req.tenant = tenant;
  req.db = connectionCache.get(tenant);

  next();
};
