// 에러 미들웨어
const httpExceptionFilter = (error, req, res, next) => {
    // 터미널에 노란색으로 출력
    console.log("\x1b[33m%s\x1b[0m", error.stack);

    if (!error.status) {
        res.status(500).send({
            status: 500,
            reason: error.message,
        });
    }
    res.status(error.status).json({
        status: error.status,
        reason: error.message,
    });
    console.error(error.stack);
}

export {httpExceptionFilter};

