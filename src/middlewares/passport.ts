import passport from "passport";
import passportLocal, {VerifyFunction} from "passport-local";
import { UserService } from "../services";

const localStrategy = passportLocal.Strategy;
const userService = new UserService();

// export const signUpMiddleware = passport.use(
//   "signup",
//   new localStrategy(
//     { usernameField: "email", passwordField: "password" },
//     async (email: string, password: string, done: any) => {
//         try {

//         } catch(err) {
//             done(err);
//         }
//     }
//   )
// );

export const loginMiddleWare = passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const user: any = await userService.getOneUser({email});

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const validate = await user.comparePassword(password);

        if (!validate) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);