import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/config.mjs'; // JWT secret, etc.

// Define the schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name must be less than 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name must be less than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Prevent password from being returned in queries
    },
    role: {
      type: String,
      enum: ['VISITER', 'CUSTOMER', 'EMPLOYEE', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR'], // Add roles as needed
      default: 'CUSTOMER',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true },
  }
);

// Virtual field for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for optimized queries
userSchema.index({ email: 1 });
userSchema.index({ isDeleted: 1 });

// Middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT
userSchema.methods.generateJWT = function () {
  const payload = { id: this._id, email: this.email, role: this.role };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
};

// Static method for soft delete
userSchema.statics.softDelete = async function (id) {
  return this.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

// Query middleware to exclude soft-deleted users
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Export the model
const User = mongoose.model('User', userSchema);

export default User;
