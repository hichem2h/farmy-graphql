import UserModel from './UserModel';
import jwt from './jwt';
import { AuthenticationError, ValidationError } from 'apollo-server';


const resolvers = {
  User: {
    __resolveType: (obj, context, info) => {
      if (obj.role == 'expert') return 'Expert'
      else if (obj.role == 'farmer') return 'Farmer'
    },
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
};

export default resolvers;
