import express from 'express';
import connectDB from './config/Database.mjs';
import session from 'express-session';
import passportConfig from './config/passport.mjs';
import passport from 'passport';
import flash from 'express-flash';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './config/Database.mjs'
import router from './routes/index.mjs';



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

passportConfig(passport)

//init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure routes
app.use('/', router)


//handle errors
app.use((req, res, next) => {// ham dung de catch loi~ khong tim thay
  const error = new HttpError('Not Found', 404)
  console.log(error);
  next(error)
})


app.use((error, req, res, next) => {
  const statusCode = 500

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack, // dung de bao loi tren ! khong duoc dung tren moi truong production
    message: error.message || 'Internal Server Error'
  })
})

// Start the server
const PORT = process.env.PORT || 5001;
const hostname = process.env.SERVER_HOST || 'localhost';



app.listen(PORT, () => console.log(`Server running at http://${hostname}:${PORT}/`));


