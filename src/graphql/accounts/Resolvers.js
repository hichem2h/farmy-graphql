import UserModel from './UserModel';
import jwt from './jwt';
import { AuthenticationError, ValidationError, UserInputError } from 'apollo-server';
import { getValidationErrors } from '../utils';


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
      
      return {
        token: jwt.generateToken(newUser),
      };

    } catch (error) {
      if (error.name != 'ValidationError') throw error
      throw new UserInputError("Bad User Input", { validationErrors: getValidationErrors(error) });
    }
  },

  updateProfile: async (obj, args, context) => {
    const { profile } = args;
    const { user } = context;

    if (!user) {
        throw new AuthenticationError('Unauthenticated');
    }

    try {

      const updatedUser = await UserModel.findOneAndUpdate({ _id: user.id }, { ...profile }, { new: true })
      return updatedUser

    } catch (error) {
      if (error.name != 'ValidationError') throw error
      throw new UserInputError("Bad User Input", { validationErrors: getValidationErrors(error) });
    }

  }
};

export default resolvers;
