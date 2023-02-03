// 기본 에러 상속
class CustomError extends Error {
    constructor(status, message) {
        super(message);
        super.status = status;
    }
}

export {CustomError};
