import {model} from 'mongoose';
import {CategorySchema} from '../schemas/category.schema';

const Category = model('categories', CategorySchema);

export class CategoryRepository {
    // 카테고리 추가
    async create(categoryName) {
        const NewCategory = await Category.create({categoryName});

        return NewCategory;
    }

    // 모든 카테고리 출력
    async findAll() {
        const categories = await Category.find({});

        return categories;
    }

    // 특정 카테고리만 출력
    async findByName(categoryName) {
        const category = await Category.findOne({categoryName});

        return category;
    }

    async findById(categoryId) {
        const category = await Category.findOne({categoryId});

        return category;
    }

    // 카테고리 수정
    async update({categoryId, update}) {
        const filter = {_id: categoryId};
        const option = {returnOriginal: false};

        const updatedCategory = await Category.findOneAndUpdate(
            filter,
            update,
            option
        );

        return updatedCategory;
    }

    // 카테고리 삭제
    async delete(categoryId) {
        const filter = {_id: categoryId};

        const deleteCategory = await Category.findOneAndDelete(filter);

        return deleteCategory;
    }
}

const categoryRepository = new CategoryRepository();

export {categoryRepository};



