import UserModel from './UserModel';
import { generateToken } from '../utils';


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

    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const correctPassword = user.authenticate(password);

    if (!correctPassword) {
      throw new Error('Invalid email or password');
    }

    return {
      token: generateToken(user),
    };
  },

  register: async (obj, args) => {
    const { email, name, password } = args;

    if (!email || !name || !password) {
      throw new Error('Please fill all the fields');
    }

    const checkEmail = UserModel.findOne({
      email,
    });

    if (!checkEmail) {
      throw new Error('This email is already registered!');
    }

    const user = new UserModel({
      name,
      email,
      password,
    });

    await user.save();

    return {
      token: generateToken(user),
    };
  },
};

export default resolvers;
