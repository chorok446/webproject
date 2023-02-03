import {userRepository} from '../db';
import bcrypt from 'bcrypt';
import {CustomError} from "../middlewares/filter";
import {authService} from "./auth.service";

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    // 전체 유저 목록 출력
    async getUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    // 특정 유저 찾기 - email, objectId
    async getUser(filter) {
        const user = await this.userRepository.findOneUser(filter);
        if (!user) {
            throw new CustomError(404, '가입된 계정정보가 없습니다. 다시 확인해 주세요.');
        }

        return await user;
    }

    // 유저 정보 수정 - 비밀번호 확인 후 수정
    async updateUser(userInfoRequired, toUpdate) {
        const {userId, currentPassword} = userInfoRequired;

        await authService.checkUser({_id: userId}, currentPassword);

        // 비밀번호 암호화
        const {password} = toUpdate;
        if (password) {
            const newPasswordHash = await bcrypt.hash(password, 10);
            toUpdate.password = newPasswordHash;
        }

        // 수정된 유저 정보 db에 반영
        const updateduser = await this.userRepository.update({
            userId,
            update: toUpdate,
        });

        return updateduser;
    }

    // 회원 탈퇴 - 유저 정보 삭제
    async deleteUser(userInfo) {
        const {userId, currentPassword} = userInfo;

        await authService.checkUser({_id: userId}, currentPassword);

        await this.userRepository.delete(userId);
    }
}

const userService = new UserService(userRepository);

export {userService};