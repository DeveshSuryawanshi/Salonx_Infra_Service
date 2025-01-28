import { User } from "../db/models/Users.model.mjs";

const validateRequest = async (req, res, next) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json({ message: 'Invalid User ID!' });
    }
    const UserModel = User();
    const user = await UserModel.findById(id);
    if(user) {
        return next();
    }
    return res.status(400).json({ message: 'Invalid User!' });
  } catch (error) {
    next(error);
  }
};

export default validateRequest;