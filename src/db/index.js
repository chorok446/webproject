import mongoose from "mongoose";
import {logger} from "../middlewares/logger/config/logger";


const DB_URL = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("connected", () =>
    logger.info("정상적으로 MongoDB 서버에 연결되었습니다. ")
);
db.on("error", (error) =>
    logger.error(
        `MongoDB 연결에 실패하였습니다... ${error}`
    )
);

export * from "./repositories/user.repository";
export * from "./repositories/product.repository";
export * from "./repositories/category.repository";
export * from "./repositories/order.repository";


