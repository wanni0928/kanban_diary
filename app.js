import express from "express";
import morgan from "morgan"; //https://www.npmjs.com/package/morgan
import routes from "./routes";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import galleryRouter from "./routers/galleryRouter";
import helmet from "helmet"; //https://www.npmjs.com/package/helmet
import bodyParser from "body-parser"; //https://www.npmjs.com/package/body-parser
import cookieParser from "cookie-parser"; //https://www.npmjs.com/package/cookie-parser
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
// import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";

import "./passport";

const app = express();
const CookieStore = MongoStore(session);
/* node js utilities */
app.use(helmet());
//utilitiy - view engine
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new CookieStore({mongooseConnection: mongoose.connection})
    })
);
app.use(passport.initialize());
app.use(passport.session());

// local variables
app.use(localsMiddleware);

// router
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.galleries, galleryRouter);

export default app;