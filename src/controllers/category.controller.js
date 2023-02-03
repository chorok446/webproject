import {Router} from "express";
import {adminGuard, checkBody, jwtGuard} from "../middlewares";
import {categoryService, productService} from "../services";
import {CategoryNameValidator} from "../middlewares/validator";

const categoryController = Router();

// 카테고리 추가
categoryController.post(
    "/",
    jwtGuard,
    adminGuard,
    checkBody,
    CategoryNameValidator,
    async (req, res, next) => {
        try {
            // req의 body 에서 데이터 가져옴
            const {categoryName} = req.body;

            // 위 데이터를 카테고리 db에 추가
            const newCategory = await categoryService.createCategory(categoryName);

            // 추가된 카테고리의 db 데이터를 프론트에 리턴
            res.status(201).json(newCategory);
        } catch (error) {
            next(error);
        }
    }
);

// 전체 카테고리 조회
categoryController.get("/", async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
});


categoryController.get("/:categoryId", async (req, res, next) => {
    try {
        const {categoryId} = req.params;
        const page = Number(req.query.page || 1);
        const perPage = Number(req.query.perPage || 10);


        const products = await productService.getProductByCategory(
            categoryId,
            page,
            perPage
        );

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
})

// 카테고리명 수정
categoryController.patch(
    "/:categoryId",
    jwtGuard,
    adminGuard,
    CategoryNameValidator,
    async (req, res, next) => {
        try {
            // req의 params과 body에서 데이터 가져옴
            const {categoryId} = req.params;
            const {categoryName} = req.body;

            // 위 데이터로 카테고리 정보 수정
            const category = await categoryService.updateCategoryById(categoryId, {
                categoryName,
            });

            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }
);

// 카테고리 삭제
categoryController.delete(
    "/:categoryId",
    jwtGuard,
    adminGuard,
    async (req, res, next) => {
        try {
            // req의 params에서 데이터 가져옴
            const {categoryId} = req.params;

            // 카테고리 정보 삭제
            const category = await categoryService.deleteCategory(categoryId);

            res.status(204);
        } catch (error) {
            next(error);
        }
    }
);

export {categoryController};

