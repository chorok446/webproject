import {CustomError} from "../filter";

const adminGuard = async (req, res, next) => {
    try {
        const userRole = req.currentUserRole;

        if (userRole !== "admin") {
            throw new CustomError(403, "허용되지 않은 접근입니다.");
        }
        next();
    } catch (error) {
        next(error);
    }
}

export {adminGuard};

