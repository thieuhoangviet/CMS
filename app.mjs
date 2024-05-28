import express from 'express';
import mongoose from 'mongoose';
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
import articleRouter from './routes/article.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {connectDB} from './config/Database.mjs'

// Load environment variables from .env file
dotenv.config();
connectDB();


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
app.use('/article', articleRouter);


// Start the server
const PORT = process.env.PORT || 5001;
const hostname = process.env.SERVER_HOST || 'localhost';
app.get('/', (req, res) => {
  res.end('<h1>Hello World!!</h1><hr>')
})
app.listen(PORT, () => console.log(`Server running at http://${hostname}:${PORT}/`));


