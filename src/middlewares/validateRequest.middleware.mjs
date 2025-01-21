import User from "../db/models/Users.model.mjs";

export default validateRequest = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: 'Invalid User ID!' });
    }
    const user = User.findById(id);
    if(user) {
        return next();
    }
    return res.status(400).json({ message: 'Invalid User!' });
  } catch (error) {
    next(error);
  }
};