import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.mjs';

export default function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Email này không được đăng ký' });
          }
          
          // So sánh password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              if (!user.emailVerified) {
                return done(null, false, { message: 'Email chưa được xác minh' });
              }
              return done(null, user);
            } else {
              return done(null, false, { message: 'Mật khẩu không đúng' });
            }
          });
        })
        .catch(err => done(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err, null));
  });
};
