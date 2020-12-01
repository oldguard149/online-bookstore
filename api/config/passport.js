const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findOne } = require('../database/db_hepler');
const { role, isResultEmpty } = require('../shared/helper');
const Q = require('../database/query');


passport.use(new LocalStrategy({
  usernameField: 'email'
},
  async function (username, password, done) {
    try {
      const userIsEmployee = await findOne(Q.user.UserInEmployee, [username]);
      const userIsCustomer = await findOne(Q.user.UserInCustomer, [username]);

      if (!isResultEmpty(userIsEmployee)) {
        const match = await bcrypt.compare(password, userIsEmployee.hash_password);
        if (match) {
          return done(null, userIsEmployee);
        } else {
          return done(null, false, {
            message: 'Wrong password'
          });
        }
      }

      if (!isResultEmpty(userIsCustomer)) {
        const match = await bcrypt.compare(password, userIsCustomer.hash_password);
        userIsCustomer['role'] = role.CUSTOMER;
        if (match) {
          return done(null, userIsCustomer);
        } else {
          return done(null, false, {
            message: 'Wrong password'
          });
        }
      }
      return done(null, false, {
        message: 'User not found'
      });

    } catch (error) {
      return done(error);
    }
  } // end of asynct function
));