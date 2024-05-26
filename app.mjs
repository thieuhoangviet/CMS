import express from 'express';
import connectDB from './config/Database.mjs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import flash from 'express-flash';
import User from './models/User.mjs';
import dotenv from 'dotenv';
import path from 'path';
import indexRouter from './routes/index.mjs';
import usersRouter from './routes/users.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define viewsPath
const viewsPath = path.join(__dirname, 'views');

// Configure views directory
app.set('views', viewsPath);
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Configure flash messages
app.use(flash());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors'); // If you also use 'error' for passport
  next();
});

// Configure Passport
import passportConfig from './config/passport.mjs';
passportConfig(passport);

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Configure routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// // Setup admin account
// function setupAdminAccount() {
//   const adminEmail = "admin@gmail.com";
//   const adminPassword = "admin"; // Ideally, use environment variables or secure methods to store this
//   const adminRole = "admin";

//   User.findOne({ email: adminEmail }).then(user => {
//     if (!user) {
//       bcrypt.genSalt(10, (err, salt) => {
//         if (err) console.error('Error generating salt:', err);
//         bcrypt.hash(adminPassword, salt, (err, hash) => {
//           if (err) console.error('Error hashing password:', err);
//           const newUser = new User({
//             name: "Admin",
//             email: adminEmail,
//             password: hash,
//             role: adminRole,
//             emailVerified: true
//           });
//           newUser.save().then(() => {
//           }).catch(err => console.error('Error saving admin user:', err));
//         });
//       });
//     }
//   }).catch(err => console.error('Error finding admin user:', err));
// }

// Call setup function when server starts
// setupAdminAccount();

// Start the server

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start the server due to database connection error:', err);
});


// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');
// flash = require('express-flash')
// const User = require('./models/User.mjs');
// require('dotenv').config();
// const path = require("path");
// const app = express();
// require('dotenv').config();


// const connectDB = require('./config/Database.mjs');
// // Kết nối tới MongoDB
// connectDB();

//   app.use(express.static(path.join(__dirname, 'public')));
// // Cấu hình session
// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(flash());

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.errors = req.flash('errors');  // Nếu bạn cũng sử dụng 'error' cho passport
//     next();
// });

// // Passport config
// require('./config/passport.mjs')(passport);

// app.set('views', path.join(__dirname, 'views'));
// // EJS
// app.set('view engine', 'ejs');

// // Body parser
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/', require('./routes/index.mjs'));
// app.use('/users', require('./routes/users.mjs'));

// function setupAdminAccount() {
//   const adminEmail = "admin@gmail.com";
//   const adminPassword = "admin"; // Lý tưởng nhất, sử dụng biến môi trường hoặc phương thức an toàn để lưu trữ này
//   const adminRole = "admin";

//   User.findOne({ email: adminEmail }).then(user => {
//       if (!user) {
//           bcrypt.genSalt(10, (err, salt) => {
//               if (err) console.error('Lỗi khi tạo salt:', err);
//               bcrypt.hash(adminPassword, salt, (err, hash) => {
//                   if (err) console.error('Lỗi khi băm mật khẩu:', err);
//                   const newUser = new User({
//                       name: "Admin",
//                       email: adminEmail,
//                       password: hash,
//                       role: adminRole,
//                       emailVerified:true
//                   });
//                   newUser.save().then(() => {
//                   }).catch(err => console.error('Lỗi khi lưu người dùng admin:', err));
//               });
//           });
//       }
//   }).catch(err => console.error('Lỗi khi tìm kiếm người dùng admin:', err));
// }

// // Gọi hàm thiết lập khi server khởi động
// setupAdminAccount();



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server running on port ${PORT}`));

