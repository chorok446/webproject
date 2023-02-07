import {CustomError} from "../filter";
import commonErrors from "../filter/error/commonErrors";


const regfullName = /^[가-힣a-zA-Z]{2,16}$/; // 영문, 한글만 2 ~ 16글자


const updateUserValidator = (req, res, next) => {
    try {
        const {phoneNumber, address, fullName, currentPassword} = req.body;

        if (!phoneNumber || !address || !fullName || !currentPassword) {
            throw new CustomError(400, commonErrors.inputError)
        }

        if (!regfullName.test(fullName)) {
            throw new CustomError(400, commonErrors.requestValidationError)
        }
        next();
    } catch (error) {
        next(error);
    }
}


export {updateUserValidator}