import {CustomError} from "../filter";
import commonErrors from "../filter/error/commonErrors";

const adminGuard = async (req, res, next) => {
    try {
        const userRole = req.currentUserRole;

        if (userRole !== "admin") {
            throw new CustomError(403, commonErrors.authorizationError);
        }
        next();
    } catch (error) {
        next(error);
    }
}

export {adminGuard};

