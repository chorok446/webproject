import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import {authController, categoryController, imageController, productController, userController} from "./controllers";
import {httpExceptionFilter} from "./middlewares";
import passport from "passport";
import morganMiddleware from "./middlewares/logger/morganMiddleware";


const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morganMiddleware);

require("./passport")();
app.use(passport.initialize());


app.use("/api/auth", authController);
app.use("/api/account", userController);
app.use("/api/product", productController);
app.use("/api/category", categoryController);
app.use("/api/image", imageController);

app.use(httpExceptionFilter);

export {app};

