import {CustomError} from "../filter";

const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const regPassword = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 영문 숫자 포함 8~ 16자리
const regfullName = /^[가-힣a-zA-Z]*$/; // 영문, 한글만

const loginvalidator = (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            throw new CustomError(400, "유효하지 않은 입력값입니다.")
        }
        next();
    } catch (error) {
        next(error);
    }
}

const signupvalidator = (req, res, next) => {
    try {
        const {email, password, fullName} = req.body;

        if (!email || !password || !fullName) {
            throw new CustomError(400, "잘못된 입력값입니다.")
        }

        if (!regEmail.test(email)) {
            throw new CustomError(400, '올바른 형식의 이메일로 입력해주세요.')
        }

        if (!regPassword.test(password)) {
            throw new CustomError(400, '올바른 형식의 비밀번호를 입력해주세요.')
        }

        if (!regfullName.test(fullName)) {
            throw new CustomError(400, "이름을 올바른 형식으로 입력해주세요.")
        }
        next();
    } catch (error) {
        next(error);
    }
}

export {loginvalidator, signupvalidator}