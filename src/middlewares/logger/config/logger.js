import winston from "winston";
import winstonDaily from 'winston-daily-rotate-file';
import process from 'process';

const {combine, timestamp, printf} = winston.format;


const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
}

winston.addColors(colors);

//* 로그 파일 저장 경로
const logDir = `${process.cwd()}/logs`;

//* log 출력 포맷 정의 함수
const logFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} [${level}] ${message}`;
});

const logger = winston.createLogger({
    //* 로그 출력 형식
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'http',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxsize: 1024 * 1024 * 5,
            maxFiles: 20,
            zippedArchive: true,
        }),

        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir + '/error',
            filename: `%DATE%.error.log`,
            maxsize: 1024 * 1024 * 5,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],

    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxsize: 1024 * 1024 * 5,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

logger.stream = {
    // morgan winston Setting
    write: (message) => {
        logger.http(message);
    },
};


if (process.env.NODE_ENV === 'development') {
    logger.add(
        new winston.transports.Console({
            level: 'http',
            format: winston.format.combine(
                winston.format.colorize({all: true}),
                timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                logFormat,
            ),
        }),
    );
}


export {logger};