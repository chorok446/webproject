import {Router} from "express";

import {loginvalidator, signupvalidator,} from "../middlewares";
import {authService} from "../services";
import {localLogin} from "../middlewares/handler";

const authController = Router();


authController.post(
    "/register", signupvalidator,
    // 유효성 검사 미들웨어
    async (req, res, next) => {
        try {
            // req (request)의 body 에서 데이터 가져오기
            const {fullName, email, password} = req.body;
            // 위 데이터를 유저 db에 추가하기 - 회원가입 완료
            await authService.addUser({
                fullName,
                email,
                password,
            });
            // 회원가입 완료시 다음 함수인 localLogin 미들웨어로 이동해서 자동으로 로그인 진행
            next();
        } catch (error) {
            next(error);
        }
    }, localLogin
);


// 로컬 로그인
authController.post(
    "/login",
    loginvalidator,
    localLogin
);


export {authController};
