import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import {authController, categoryController, orderController, productController, userController} from "./controllers";
import {httpExceptionFilter} from "./middlewares";
import passport from "passport";
import morgan from "morgan";
import {imageController} from "./controllers/image.controller";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan("dev"));

require("./passport")();
app.use(passport.initialize());


app.use("/api/auth", authController);
app.use("/api/account", userController);
app.use("/api/product", productController);
app.use("/api/category", categoryController);
app.use("/api/order", orderController);
app.use("/api/image", imageController);

app.use(httpExceptionFilter);

export {app};

