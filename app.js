const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
flash = require('express-flash')
const User = require('./models/User');
require('dotenv').config();
const path = require("path");
const app = express();
require('dotenv').config();


const connectDB = require('./config/Database');
// Kết nối tới MongoDB
connectDB();

  app.use(express.static(path.join(__dirname, 'public')));
// Cấu hình session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.errors = req.flash('errors');  // Nếu bạn cũng sử dụng 'error' cho passport
    next();
});

// Passport config
require('./config/passport')(passport);

app.set('views', path.join(__dirname, 'views'));
// EJS
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

function setupAdminAccount() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin"; // Lý tưởng nhất, sử dụng biến môi trường hoặc phương thức an toàn để lưu trữ này
  const adminRole = "admin";

  User.findOne({ email: adminEmail }).then(user => {
      if (!user) {
          bcrypt.genSalt(10, (err, salt) => {
              if (err) console.error('Lỗi khi tạo salt:', err);
              bcrypt.hash(adminPassword, salt, (err, hash) => {
                  if (err) console.error('Lỗi khi băm mật khẩu:', err);
                  const newUser = new User({
                      name: "Admin",
                      email: adminEmail,
                      password: hash,
                      role: adminRole,
                      emailVerified:true
                  });
                  newUser.save().then(() => {
                  }).catch(err => console.error('Lỗi khi lưu người dùng admin:', err));
              });
          });
      }
  }).catch(err => console.error('Lỗi khi tìm kiếm người dùng admin:', err));
}

// Gọi hàm thiết lập khi server khởi động
setupAdminAccount();



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));

