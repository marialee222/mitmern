// backend/createAdminUser.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();


const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    let user = await User.findOne({ email: adminEmail });
    if (user) {
      console.log('Admin user already exists');
    } else {
      user = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });

      await user.save();
      console.log('Admin user created successfully');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin user:', err);
    mongoose.connection.close();
  }
};

createAdminUser();
