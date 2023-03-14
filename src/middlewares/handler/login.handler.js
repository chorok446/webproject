import passport from "passport";


const localLogin = (req, res, next) => {
    passport.authenticate(
        "local",
        {session: false},
        (err, loginData) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json(loginData);
        }
    )(req, res, next);
}

export {localLogin}