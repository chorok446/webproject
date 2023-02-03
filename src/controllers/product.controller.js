import {Router} from "express";
import {adminGuard, jwtGuard} from "../middlewares";
import {productService} from "../services";

const productController = Router();

// 상품 등록 api
productController.post(
    "/",
    jwtGuard,
    adminGuard,
    async (req, res, next) => {
        try {
            const {productName, category, company, price, imagePath, info, color} =
                req.body;

            // 위 데이터를 상품 db에 추가하기
            const newProduct = await productService.addProduct({
                productName,
                category,
                company,
                price,
                imagePath,
                info,
                option: {
                    color,
                },
            });

            // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    }
);

// 홈화면에 표시할 최신순으로 정렬한 전체 상품 목록
productController.get("/main/recent", async (req, res, next) => {
    try {
        const page = Number(req.query.page || 1);
        const perPage = Number(req.query.perPage || 10);

        const products = await productService.getProducts(page, perPage);

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// 홈화면에 표시할 상품 목록(상위 4개)
productController.get("/main", async (req, res, next) => {
    try {
        const products = await productService.getPopularAndRecent();

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// 특정 상품 조회
productController.get("/:productId", async (req, res, next) => {
    try {
        // req의 params에서 데이터 가져옴
        const {productId} = req.params;

        // id를 기준으로 DB 조회
        const product = await productService.getProductById(productId);

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// 상품 정보 수정
productController.put(
    "/:productId",
    jwtGuard,
    adminGuard,
    async (req, res, next) => {
        try {
            // req의 params와 body에서 데이터 가져옴
            const {productId} = req.params;
            const {productName, category, company, price, imagePath, info, color} =
                req.body;

            // 데이터를 상품 db에 반영하기
            const updateProduct = await productService.setProduct(productId, {
                productName,
                category,
                company,
                price,
                imagePath,
                info,
                option: {
                    color,
                },
            });

            res.status(201).json(updateProduct);
        } catch (error) {
            next(error);
        }
    }
);

// 상품 정보 삭제
productController.delete(
    "/:productId",
    jwtGuard,
    adminGuard,
    async (req, res, next) => {
        try {
            const {productId} = req.params;

            const deleteProduct = await productService.deleteProduct(productId);

            res.status(204)
        } catch (error) {
            next(error);
        }
    }
);

export {productController};
