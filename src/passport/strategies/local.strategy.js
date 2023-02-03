import {Strategy} from "passport-local";
import jwt from 'jsonwebtoken';
import {authService} from "../../services";

// jwt secretKey Setting
const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

// 로컬 로그인 필드 설정
const config = {
    usernameField: 'email',
    passwordField: 'password'
};

// 로컬 strategy
const local = new Strategy(config, async (email, password, done) => {
    try {
        // 유저 확인
        const user = await authService.checkUser({email}, password);
        // 유저 id와 role을 jwt 토큰에 담음
        const token = jwt.sign(
            {type: 'JWT', userId: user._id, userEmail: user.email, userRole: user.role},
            secretKey, {
                expiresIn: "1h"
            }
        );
        const userRole = user.role;

        done(null, {token, userRole});
    } catch (err) {
        done(err, null);
    }
})

export default local;