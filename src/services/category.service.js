import {categoryRepository} from "../db";
import {CustomError} from "../middlewares/filter";
import commonErrors from "../middlewares/filter/error/commonErrors";

class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // 카테고리 추가
    async createCategory(categoryName) {
        const category = await this.categoryRepository.findByName(categoryName);

        if (category) {
            throw new CustomError(400, commonErrors.resourceDuplicationError);
        }

        const NewCategory = await this.categoryRepository.create(
            categoryName
        );
        return NewCategory;
    }

    // 전체 카테고리 조회
    async getCategories() {
        const categories = await this.categoryRepository.findAll();

        return categories;
    }

    // 카테고리명으로 조회
    async getCategoryByName(categoryName) {
        // 해당 이름의 카테고리가 db에 존재하는지 확인
        const category = await this.categoryRepository.findByName(categoryName);

        if (!category) {
            throw new CustomError(404, commonErrors.resourceNotFoundError)
        }

        return category;
    }

    async getCategoryById(categoryId) {
        // 해당 이름의 카테고리가 db에 존재하는지 확인
        const category = await this.categoryRepository.findById(categoryId);
        return category;
    }

    // 카테고리명 수정
    async updateCategoryById(categoryId, update) {

        const category = await this.getCategoryById(categoryId);


        const updatedcategory = await this.categoryRepository.update({
            categoryId,
            update,
        });

        return updatedcategory;
    }

    // 카테고리 삭제
    async deleteCategory(categoryId) {

        const category = await this.categoryRepository.findById(categoryId);

        if (!category) {
            throw new CustomError(404, commonErrors.resourceNotFoundError)
        }

        const deletecategory = await this.categoryRepository.delete(categoryId);

        return deletecategory;
    }
}

const categoryService = new CategoryService(categoryRepository);

export {categoryService};

