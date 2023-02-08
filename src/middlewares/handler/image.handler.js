const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const AWS = require("aws-sdk");
const dotenv = require('dotenv');
const {CustomError} = require("../filter");
const CommonErrors = require("../filter/error/commonErrors");
const {secretAccessKey, bucket, region, accessKeyId} = require("../../config/aws.config");
dotenv.config({path: './.env'});

// 환경변수 정의 안되어 있을시
if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    throw new CustomError(500, CommonErrors.configError);
}


const s3 = new AWS.S3({ //AWS SDK 설정 항목
    accessKeyId,
    secretAccessKey,
    region,
});

const storage = multerS3({ //multerS3 설정 항목
    s3: s3,
    bucket, //bucket 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write', //읽고 쓰기 모두 허용
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now().toString() + extension)
    },
})

exports.upload = multer({storage: storage});