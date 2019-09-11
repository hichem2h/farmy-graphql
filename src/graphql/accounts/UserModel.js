import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      hidden: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'farmer', 'expert']
    },
    domain: {
      type: String,
      required: false
    },
    expertise: {
      type: [String],
      required: false,
      default: []
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

Schema.plugin(uniqueValidator, { message: 'Email {VALUE} is already used' });

Schema.pre('save', function (next) {
  // Hash the password
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

Schema.methods = {
  encryptPassword(password) {
    return bcrypt.hashSync(password, 8);
  },
};

Schema.statics.authenticate = async function (email, password) {
  const user = await this.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      return user
    }
  } else {
    bcrypt.hashSync(password)
  }

  return null
};

Schema.statics.validateEmail = async function (email, password) {

  const checkEmail = await this.findOne({
    email,
  });

  if (checkEmail) {
    return false
  } else {
    return true
  }

};

export default mongoose.model('User', Schema);
