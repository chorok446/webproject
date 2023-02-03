import jwt from "jsonwebtoken";
import {CustomError} from "../filter";

const jwtGuard = (req, res, next) => {
    // request 헤더로부터 authorization bearer 토큰을 받음.
    const userToken = req.headers["authorization"]?.split(" ")[1];

    // 토큰이 "null"없거나 null 일경우 일 경우, login_required 가 필요한 서비스 사용을 제한
    if (!userToken || userToken === "null") {
        throw new CustomError(401, "잘못된 접근입니다. 로그인 후 다시 시도해주세요.");
    }

    // 해당 token 이 정상적인 token인지 확인
    try {
        const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
        const jwtDecoded = jwt.verify(userToken, secretKey);

        const userId = jwtDecoded.userId;
        const userRole = jwtDecoded.userRole;

        // 라우터에서 req.currentUserId와 req.currentUserRole을 통해 유저의 id 및 role 에 접근
        req.currentUserId = userId;
        req.currentUserRole = userRole;

        next();
    } catch (error) {
        // 토큰이 정상적으로 decode 안되었을 경우 예외처리
        throw new CustomError(401, "유효하지 않은 토큰 입니다. 다시 로그인해주세요.");
    }
}

export {jwtGuard};

