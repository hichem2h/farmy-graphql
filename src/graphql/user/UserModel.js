import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
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
    cropType: {
      type: String,
    },
    domain: {
      type: String,
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

Schema.pre('save', function (next) {
  // Hash the password
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

Schema.methods = {
  authenticate(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword(password) {
    return bcrypt.hashSync(password, 8);
  },
};

export default mongoose.model('User', Schema);
