require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cookieParser = require("cookie-parser");
const {validateCookie} = require("./middlewares/authentication");
const Product = require("./models/product");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL).then(e=>{console.log("MongoDB connected")});
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve("./public")));

app.use(cookieParser());
app.use(validateCookie("token"));

app.get("/", async (req, res) => {
    const allProducts = await Product.find({});

    res.render("home", {
        user: req.user,
        products: allProducts
    });
});


app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(PORT , ()=> console.log('server started on port', PORT));

