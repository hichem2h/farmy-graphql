import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config';
import UserModel from './user/UserModel';


export const generateToken = (user) => `JWT ${jwt.sign({ id: user.email }, jwtSecret)}`;

export const getUser = async (token) => {
  if (!token) {
    return {
      user: null,
    };
  }

  try {
    const decodedToken = jwt.verify(token.substring(4), jwtSecret);

    const user = await UserModel.findOne({ email: decodedToken.id });

    return {
      user,
    };
  } catch (err) {
    return {
      user: null,
    };
  }
};
