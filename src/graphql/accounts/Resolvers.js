import UserModel from './UserModel';
import jwt from './jwt';
import { AuthenticationError, ValidationError } from 'apollo-server';


const resolvers = {
  User: {

  },

  me: (obj, args, context) => context.user,

  login: async (obj, args) => {
    const { email, password } = args;

    const user = await UserModel.authenticate(email, password);

    if (!user) {
      throw new ValidationError('Invalid email or password');
    }

    return {
      token: jwt.generateToken(user),
    };
  },

  refresh: async (obj, args) => {
    const { token } = args;

    const newToken = await jwt.refreshToken(token)

    if(!newToken) {
      throw new ValidationError('Bad Token');
    }

    return {
      token: newToken,
    };
  },

  register: async (obj, args) => {
    const {user} = args;

    const newUser = new UserModel({
      ...user
    })

    try {
      await newUser.save();
    } catch (err) {
      throw new ValidationError(err);
    }

    return {
      token: jwt.generateToken(newUser),
    };
  },

  updateProfile: async (obj, args, context) => {
    const { profile } = args;
    const { user } = context;

    if (!user) {
        throw new AuthenticationError('Unauthenticated');
    }

    const updatedUser = await UserModel.findOneAndUpdate({ _id: user.id }, { ...profile }, { new: true, useFindAndModify: false })

    return updatedUser
  }
};

export default resolvers;
