import {Router} from "express";
import {upload} from "../middlewares/handler/image.handler";
import {adminGuard, jwtGuard} from "../middlewares";


const imageController = Router();
const aws_url = process.env.AWS_S3_URL

//로그인 및 관리자만 접근가능
imageController.post("/", jwtGuard, adminGuard, upload.array('images'), async (req, res, next) => {
        try {
            // 버킷에 업로드된 파일 도메인 연결
            const imagePath = req.files.map((image) => `${aws_url}${image.key}`);

            res.status(200).json(imagePath);
        } catch (error) {
            next(error);
        }
    }
);


export {imageController};

