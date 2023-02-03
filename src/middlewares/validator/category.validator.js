import {CustomError} from "../filter";


const regCategory = /^[가-힣a-zA-Z]*$/; // 영문, 한글만
const CategoryNameValidator = (req, res, next) => {
    try {
        const {categoryName} = req.body;
        if (!categoryName) {
            throw new CustomError(400, "유효하지 않은 입력값입니다.")
        }
        if (!regCategory.test(categoryName)) {
            throw new CustomError(400, "영문이나 한글만 입력가능합니다.")
        }
        next();
    } catch (error) {
        next(error);
    }
}

export {CategoryNameValidator};