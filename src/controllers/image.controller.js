import {Router} from "express";
import {upload} from "../middlewares/handler/image.handler";
import {adminGuard, jwtGuard} from "../middlewares";
import {bucket, region} from "../config/aws.config";

const imageController = Router();
// aws 버킷 도메인
const aws_url = `https://${bucket}.s3.${region}.amazonaws.com/`


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

