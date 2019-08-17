import jwt from 'jsonwebtoken';
import { jwtSecret, jwtOptions } from '../../config';
import UserModel from './UserModel';


export default {
  generateToken: (user) => {

    let payload = {
      sub: user.email,
      role: user.role,
      name: user.name
    }

    return `JWT ${jwt.sign(payload, jwtSecret, jwtOptions)}`;
  },

  getUser: async (token) => {
    try {
      const decodedToken = jwt.verify(token.substring(4), jwtSecret);
      const user = await UserModel.findOne({ email: decodedToken.sub });
      return user

    } catch (error) {
      return null
    }
  },

  refreshToken: async function(token) {
    let user = await this.getUser(token)

    if (user) {
      let payload = {
        sub: user.email,
        role: user.role,
        name: user.name
      }

      return `JWT ${jwt.sign(payload, jwtSecret, jwtOptions)}`;
    }
  }
}
