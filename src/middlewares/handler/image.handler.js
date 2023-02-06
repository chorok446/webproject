const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const AWS = require("aws-sdk");
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const s3 = new AWS.S3({ //AWS SDK 설정 항목
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});

const storage = multerS3({ //multerS3 설정 항목
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, //bucket 이름
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read', //읽고 쓰기 모두 허용
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now().toString() + extension)
    },
})

exports.upload = multer({storage: storage});