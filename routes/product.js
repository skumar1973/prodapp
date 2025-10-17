
const {Router} = require("express");
const multer = require("multer");
const path = require("path");

const Product = require("../models/product");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads/'))
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + '-' + file.originalname ;
    cb(null, fileName)
  }
});

const upload = multer({ storage: storage });

router.get("/create", (req, res) => {
    return res.render("addproduct", {user : req.user});
});

router.post("/", upload.single("productImageURL"), async (req, res) =>{
    
    console.log(req.body);
    console.log(req.file);

    const {productImageURL, code, name} = req.body;
    await Product.create({
        productImageURL : `/uploads/${req.file.filename}`,
        code,
        name,
        createdBy: req.user._id
    });

    return res.redirect("/");
});

router.get("/:id", async (req,res) => {
  console.log(req.params.id);
  const id = req.params.id;
  const product = await Product.findById({'_id' : id}).populate("createdBy");
  console.log(product);
  return res.render("viewproduct", {user : req.user, product});
});

module.exports = router;