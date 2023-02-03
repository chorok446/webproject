import {Schema} from 'mongoose';

const OrderSchema = new Schema(
    {
        // 주문자
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        products: [new Schema({
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
            option: {
                type: {
                    color: String,
                },
                required: true,
                _id: false,
            },
            quantity: {
                type: Number,
                required: true,
            },
        })],
        totalprice: {
            type: Number,
            required: true,
        },
        recipient: { // 배송받는 사람
            type: String,
            required: true,
        },
        address: { // 주소
            type: new Schema({
                    postalCode: String,
                    address1: String,
                    address2: String
                },
                {
                    _id: false,
                }),
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        status: { // 주문상태
            type: String,
            enum: ['배송준비중', '배송중', '배송완료'],
            required: true,
        },
    },
    {
        collection: 'orders',
        timestamps: true,
    }
);

export {OrderSchema};