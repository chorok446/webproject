import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import {authController, categoryController, imageController, productController, userController} from "./controllers";
import {httpExceptionFilter} from "./middlewares";
import passport from "passport";
import {logger} from "./middlewares/logger/config/logger";
import morgan from "morgan";
import morganMiddleware from "./middlewares/logger/morganMiddleware";
import {CustomError} from "./middlewares/filter";
import commonErrors from "./middlewares/filter/error/commonErrors";


const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan(":method :status :url :response-time ms ip: :remote-addr", {stream: logger.stream}));
} else if (process.env.NODE_ENV === 'production') {
    app.use(morganMiddleware);
} else {
    throw new CustomError(500, commonErrors.configError);
}


require("./passport")();
app.use(passport.initialize());


app.use("/api/auth", authController);
app.use("/api/account", userController);
app.use("/api/product", productController);
app.use("/api/category", categoryController);
app.use("/api/image", imageController);

// 404 에러 핸들러
app.use((req, res, next) => {
    throw new CustomError(404, commonErrors.resourceNotFoundError);
});

app.use(httpExceptionFilter);

export {app};

