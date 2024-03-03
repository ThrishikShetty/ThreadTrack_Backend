import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProducts,
  getAdminProducts,
  getAllBrand,
  getAllCategories,
  getAllColor,
  getAllProducts,
  getAllSize,
  getAllStyle,
  getSingleProducts,
  getlatestProducts,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

//To Create New Product  - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);

//To get all products with filter - /api/v1/product/latest
app.get("/all", getAllProducts);

//To get last 10 Products  - /api/v1/product/latest
app.get("/latest", getlatestProducts);

//To get all unique Categories  - /api/v1/product/categories
app.get("/categories", getAllCategories);

app.get("/size", getAllSize);

app.get("/color", getAllColor);

app.get("/brand", getAllBrand);

app.get("/style", getAllStyle);

//To get all Products   - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);

app
  .route("/:id")
  .get(getSingleProducts)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProducts);

export default app;
