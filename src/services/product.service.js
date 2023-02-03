import {productRepository} from "../db";
import {CustomError} from "../middlewares/filter";
import {categoryService} from "./index";


class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }


    // 상품 등록
    async addProduct(productInfo) {
        // 입력된 카테고리를 카테고리 DB에서 검색 
        const category = await categoryService.getCategoryByName(
            productInfo.category
        );

        if (!category) {
            throw new CustomError(404, "카테고리를 찾을수 없습니다.");
        }

        productInfo.category = category;

        const createdNewProduct = await this.productRepository.create(productInfo);

        return createdNewProduct;
    }

    // 전체 상품 최신순 조회
    async getProducts(page, perPage) {
        const products = await this.productRepository.findAll(page, perPage);

        return products;
    }

    // 홈화면 인기 상품 조회
    async getPopularAndRecent() {
        const popularProducts = await this.productRepository.findPopular(4);

        return popularProducts;
    }

    // 카테고리별 상품 조회
    async getProductByCategory(categoryId, page, perPage) {
        const products = await this.productRepository.findByCategory(
            categoryId,
            page,
            perPage
        );

        return products;
    }

    // 특정 상품 조회
    async getProductById(productId) {
        //  해당 상품이 db에 존재하는지 확인
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new CustomError(
                404, "해당 상품이 존재하지 않습니다. 다시 확인하고 시도해 주세요."
            );
        }
        return product;
    }

    // 상품의 orderCount 증감
    async increaseOrderCount(productId, amount) {

        await this.getProductById(productId);

        const orderproduct = await this.productRepository.update(productId, {
            $inc: {orderCount: amount},
        });

        return orderproduct;
    }

    // 상품 정보 수정
    async setProduct(productId, update) {

        let NewCategory = update

        // 입력된 카테고리를 카테고리 DB에서 검색 
        NewCategory.category = await categoryService.getCategoryByName(
            update.category
        );


        const product = await this.productRepository.update(productId, NewCategory);

        return product;
    }

    // 상품 정보 삭제
    async deleteProduct(productId) {

        await this.getProductById(productId);

        const deletedproduct = await this.productRepository.delete(productId);

        return deletedproduct;
    }
}

const productService = new ProductService(productRepository);

export {productService};

