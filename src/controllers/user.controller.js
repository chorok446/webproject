import {Router} from "express";

import {adminGuard, jwtGuard,} from "../middlewares";
import {CustomError} from "../middlewares/filter";
import {userService} from "../services";
import {updateUserValidator} from "../middlewares/validator";

const userController = Router();


// 전체 유저 목록 배열로 반환
// 토큰 검증 및 어드민 권한 검증
userController.get("/users",
    jwtGuard,
    adminGuard,
    async (req, res, next) => {
        try {
            // 전체 사용자 목록을 얻음
            const users = await userService.getUsers();

            // 사용자 목록(배열)을 JSON 형태로 프론트에 반환
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
);

// 로그인한 유저 찾기
userController.get("/user", jwtGuard, async (req, res, next) => {
    try {
        // req에서 현재 로그인한 사용자의 Id 가져옴
        const userId = req.currentUserId;

        const user = await userService.getUser({_id: userId});

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

// 사용자 정보 수정
userController.put("/user", jwtGuard, updateUserValidator, async (req, res, next) => {
    try {
        // req에서 현재 로그인한 사용자의 Id 가져옴
        const userId = req.currentUserId;

        // body data 로부터 업데이트할 사용자 정보를 추출
        const {fullName, address, phoneNumber, currentPassword} = req.body;


        const userInfoRequired = {userId, currentPassword};

        // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해 보내주었다면, 업데이트용 객체에 삽입
        const toUpdate = {
            ...(fullName && {fullName}),
            ...(address && {address}),
            ...(phoneNumber && {phoneNumber}),
        };

        // 사용자 정보를 업데이트함.
        const updatedUserInfo = await userService.updateUser(
            userInfoRequired,
            toUpdate
        );

        // 업데이트 이후의 유저 데이터를 프론트에 반환
        res.status(200).json(updatedUserInfo);
    } catch (error) {
        next(error);
    }
});

/** 사용자 정보 삭제 **/
userController.delete("/user", jwtGuard, async (req, res, next) => {
    try {
        const currentPassword = req.body.currentPassword;
        if (!currentPassword) {
            throw new CustomError(401, "탈퇴하려면, 현재의 비밀번호가 필요합니다.");
        }

        const userId = req.currentUserId;
        const userInfo = {userId, currentPassword};

        await userService.deleteUser(userInfo);

        res.status(204);
    } catch (error) {
        next(error);
    }
});

export {userController};

