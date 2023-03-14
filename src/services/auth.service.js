import {userRepository} from '../db';
import bcrypt from 'bcrypt';
import {CustomError} from "../middlewares/filter";
import commonErrors from "../middlewares/filter/error/commonErrors";

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    // 로그인
    async checkUser(filter, password) {
        // 해당 이메일의 사용자 정보가 db에 존재하는지 확인
        const user = await this.userRepository.findOneUser(filter);
        if (!user) {
            throw new CustomError(
                404, commonErrors.resourceNotFoundError
            );
        }

        // 비밀번호 일치 여부 확인
        const correctPasswordHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
        if (!isPasswordCorrect) {
            throw new CustomError(
                400, commonErrors.inputError
            );
        }

        return user;
    }

    // 회원가입
    async addUser(userInfo) {
        const {email, fullName, password} = userInfo;

        // 이메일 중복 확인
        const user = await this.userRepository.findOneUser({email});
        if (user) {
            throw new CustomError(
                400, commonErrors.resourceDuplicationError
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserInfo = {fullName, email, password: hashedPassword};

        // db에 저장
        await this.userRepository.create(newUserInfo);

    }

}

const authService = new AuthService(userRepository);
export {authService};