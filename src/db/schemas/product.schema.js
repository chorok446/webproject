import {Schema} from "mongoose";

const ProductSchema = new Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imagePath: {
            type: [String],
            required: true,
        },
        info: {
            type: String,
            required: true,
        },
        option: {
            type: new Schema(
                {
                    color: [String],
                },
                {
                    _id: false,
                }
            ),
            required: true,
        },
        orderCount: {
            type: Number,
            default: 0,
        },
    },
    {
        collection: "products",
        timestamps: true,
    }
).index(
    {
        productName: "text", // 상품이름으로 검색
        info: "text",
        "option.color": "text",
    },
    {
        weights: {
            productName: 3,
            info: 2,
            "option.color": 1,
        },
    }
);

export {ProductSchema};
