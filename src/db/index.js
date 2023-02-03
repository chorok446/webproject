import mongoose from "mongoose";

const DB_URL = process.env.MONGODB_URL;

mongoose.set('strictQuery', true)
mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", () =>
    console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + DB_URL)
);
db.on("error", (error) =>
    console.error(
        `MongoDB 연결에 실패하였습니다...${DB_URL}  ${error}`
    )
);

export * from "./repositories/user.repository";
export * from "./repositories/product.repository";
export * from "./repositories/category.repository";
export * from "./repositories/order.repository";


