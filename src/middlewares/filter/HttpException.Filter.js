// 에러 미들웨어


import {logger} from "../logger/config/logger";

const httpExceptionFilter = (error, req, res, next) => {

    if (!error.status) {
        res.status(500).send({
            error: error.message,
        });
    }
    res.status(error.status).json({
        error: error.message,
    });
    logger.error(`${error.status} ${error.message}`);
}

export {httpExceptionFilter};

