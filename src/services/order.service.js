import {orderRepository} from "../db";
import {productService} from "./index";
import {CustomError} from "../middlewares/filter";

const OrderState = ["상품 준비중", "상품 배송중", "배송 완료"];

class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 주문 추가
    async addOrder(orderInfo) {
        // 전체 상품 정보 가져온 후 알맞은 상품을 할당
        const allProduct = await productService.getProducts();
        orderInfo.products = orderInfo.products.map((product) => {
            productService.increaseOrderCount(product.productId, 1);


            return {
                // 모든 상품에서 id가 같은것을 찾아서 할당
                product: allProduct.datas.find(
                    (p) => p._id == product.productId
                ),
                // 옵션 및 수량 할당
                option: product.option,
                quantity: product.quantity,
            };
        });

        // 주문 총액 계산
        orderInfo.priceTotal = orderInfo.products.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        // 주문 상태 할당
        orderInfo.state = OrderState[0];

        const createdNewOrder = await this.orderRepository.create(orderInfo);

        return createdNewOrder;
    }

    // 모든 주문 조회
    async getOrders(page, perPage) {
        const orders = await this.orderRepository.findAll(page, perPage);

        return orders;
    }

    // 유저별 주문 내역 조회
    async getOrderByUser(userId, page, perPage) {
        // 해당 유저의 주문 내역이 db에 존재하는지 확인
        const orders = await this.orderRepository.findByUser(userId, page, perPage);

        return orders;
    }

    // 특정 주문 내역 조회
    async getOrderById(userRole, userId, orderId) {
        //  해당 주문 내역이 존재하는지 확인
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
            throw new CustomError(404, "해당 주문 내역이 존재하지 않습니다. 다시 확인해 주세요.");
        }

        // user가 다른 사람의 주문 내역에 접근할 수 없도록 제한
        if (userRole !== "admin" && userId !== order.customer._id) {
            throw new CustomError(
                403, "허용되지 않은 접근입니다."
            );
        }

        return order;
    }

    // 특정 주문의 특정 상품 조회
    async getOrderProduct(orderId, orderProductId) {
        // 해당 주문 내역이 존재하는지 확인
        const orderProduct = await this.orderRepository.findByProduct(
            orderId,
            orderProductId
        );
        if (!orderProduct.products) {
            throw new CustomError(404, "해당 상품을 찾을 수 없습니다. 다시 확인해주세요.")
        }

        return orderProduct;
    }

    // 주문 상태 변경
    async updateOrder(orderId, stateCode) {
        if (stateCode < 0 || stateCode >= OrderState.length) {
            throw new CustomError(
                400, "유효하지 않은 상태코드입니다. 올바른 상태코드를 입력해주세요."
            );
        }

        const updateOrder = await this.orderRepository.update(
            {_id: orderId},
            {state: OrderState[stateCode]}
        );

        return updateOrder;
    }

    // 주문 상품 부분 삭제 - 부분 취소
    async updateByProduct(userRole, userId, orderId, orderProductId) {
        // 해당 상품을 주문했는지 조회
        const order = await this.getOrderProduct(orderId, orderProductId);
        // 관리자만 접근 가능
        if (userRole !== "admin" && userId !== order.customer) {
            throw new CustomError(
                403, "잘못된 접근입니다. 다시 시도해주세요."
            );
        }

        // 수정할 주문 데이터 객체 생성
        const updateProduct = {
            $pull: {
                products: {
                    _id: orderProductId,
                },
            },
        };

        const updateOrder = await this.orderRepository.update(
            {_id: orderId},
            updateProduct
        );
        await productService.increaseOrderCount(order.products[0].product, -1);

        // 주문한 전체 상품이 전부 취소되어서 주문내역이 0보다 작아지면 주문내역 삭제
        if (updateOrder.products.length < 1) {
            const deletedOrder = await this.deleteOrder(userRole, userId, order);
            return deletedOrder;
        }

        return updateOrder;
    }

    // 주문 정보 삭제 - 주문 취소
    async deleteOrder(userRole, userId, orderId) {
        // id를 기준으로 DB 에서 주문 내역 조회
        const order = await this.getOrderById(userRole, userId, orderId);
        order.products.map((p) =>
            productService.increaseOrderCount(p.product, -1)
        );

        const deleteOrder = await this.orderRepository.delete(order);

        return deleteOrder;
    }
}

const orderService = new OrderService(orderRepository);

export {orderService};
