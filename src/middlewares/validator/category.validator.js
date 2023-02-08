import {CustomError} from "../filter";
import commonErrors from "../filter/error/commonErrors";


const regCategory = /^[가-힣a-zA-Z]*$/; // 영문, 한글만
const CategoryNameValidator = (req, res, next) => {
    try {
        const {categoryName} = req.body;
        if (!categoryName) {
            throw new CustomError(400, commonErrors.argumentError)
        }
        if (!regCategory.test(categoryName)) {
            throw new CustomError(400, commonErrors.requestValidationError)
        }
        next();
    } catch (error) {
        next(error);
    }
}

export {CategoryNameValidator};