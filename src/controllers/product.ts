import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/products.js";
import ErrorHandler from "../utils/utils-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

//revalidate on new ,update , delete product , and new order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-products"))
    products = JSON.parse(myCache.get("latest-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

//revalidate on new ,update , delete product , and new order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(201).json({
    success: true,
    categories,
  });
});

export const getAllSize = TryCatch(async (req, res, next) => {
  let size;

  if (myCache.has("Size"))
    size = JSON.parse(myCache.get("Size") as string);
  else {
    size = await Product.distinct("size");
    myCache.set("Size", JSON.stringify(size));
  }

  return res.status(201).json({
    success: true,
    size,
  });
});

export const getAllColor = TryCatch(async (req, res, next) => {
  let color;

  if (myCache.has("Color"))
    color = JSON.parse(myCache.get("Color") as string);
  else {
    color = await Product.distinct("color");
    myCache.set("Color", JSON.stringify(color));
  }

  return res.status(201).json({
    success: true,
    color,
  });
});
export const getAllBrand = TryCatch(async (req, res, next) => {
  let brand;

  if (myCache.has("Brand"))
    brand = JSON.parse(myCache.get("Brand") as string);
  else {
    brand = await Product.distinct("brand");
    myCache.set("Brand", JSON.stringify(brand));
  }

  return res.status(201).json({
    success: true,
    brand,
  });
});
export const getAllStyle = TryCatch(async (req, res, next) => {
  let style;

  if (myCache.has("Style"))
    style = JSON.parse(myCache.get("Style") as string);
  else {
    style = await Product.distinct("style");
    myCache.set("Brand", JSON.stringify(style));
  }

  return res.status(201).json({
    success: true,
    style,
  });
});

//revalidate on new ,update , delete product , and new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }
  return res.status(201).json({
    success: true,
    products,
  });
});

export const getSingleProducts = TryCatch(async (req, res, next) => {
  // const id = req.params.id;
  // const product = await Product.findById(req.params.id);
  // console.log(product)
  // if (!product) return next(new ErrorHandler("Product not found", 404));

  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(201).json({
    success: true,
    product,
  });
});

//revalidate the cache after new , update or delete the product
//see features ffolder for revalidate function

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category, brand, style, color, size } =
      req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add photo", 400));

    if (
      !name ||
      !price ||
      !stock ||
      !category ||
      !brand ||
      !style ||
      !color ||
      !size
    ) {
      rm(photo.path, () => {
        console.log("deleted");
      });
      return next(new ErrorHandler("Please fill all fields", 400));
    }
    if (size.length > 3)
      return next(
        new ErrorHandler("Please Enter size as XS , S , M , L, XL,XXL ", 400)
      );
    if (
      size.toUpperCase() !== "XS" &&
      size.toUpperCase() !== "S" &&
      size.toUpperCase() !== "M" &&
      size.toUpperCase() !== "L" &&
      size.toUpperCase() !== "XL" &&
      size.toUpperCase() !== "XXL"
    )
      return next(
        new ErrorHandler("Please Enter size as XS, S, M, L, XL, XXL ", 400)
      );

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      brand: brand,
      style: style.toLowerCase(),
      color: color.toLowerCase(),
      size: size.toUpperCase(),
      photo: photo.path,
    });

    //reavlidate

    await invalidateCache({ product: true,admin:true });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, brand, style, color, size } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("old photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();
  if (brand) product.brand = brand.toLowerCase();
  if (style) product.style = style.toLowerCase();
  if (color) product.color = color.toLowerCase();
  if (size) product.size = size.toLowerCase();

  await product.save();
  //ravalidate
  await invalidateCache({ product: true, admin:true ,productId: String(product._id) });
  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

export const deleteProducts = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  rm(product.photo!, () => {
    console.log("Product photo deleted");
  });

  await product.deleteOne();

  //reavlidate
  await invalidateCache({ product: true,admin:true , productId: String(product._id) });

  return res.status(201).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price, stock, color, brand, size, style } =
      req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE || 8);
    const skip = (page - 1) * limit;

    // BaAA
    const baseQuery: BaseQuery = {
      // empty
      // name:{
      //   $regex:search ,
      //   $options:"i"
      //  },
      //  price:{
      //   $lte:Number(price) ,
      //  },
      //  stock:{
      //   $gte:Number(stock) ,
      //    },
      //  brand:{
      //   $regex:brand ,
      //   $options:"i"
      //  },
      //  category
    };

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (stock)
      baseQuery.stock = {
        $gte: Number(stock),
      };

    if (category) baseQuery.category = category;
    if (color) baseQuery.color = color;
    if (brand) baseQuery.brand = brand;
    if (size) baseQuery.size = size;
    if (style) baseQuery.style = style;

    // if(stock)
    // baseQuery.stock={
    //   $gte:Number(stock) ,
    //   }

    // const products = await Product.find(baseQuery)
    //   .sort(sort && { price: sort === "asc" ? 1 : -1 })
    //   .limit(limit)
    //   .skip(skip);

    // const filteredOnlyProduct =  await Product.find(baseQuery)

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(201).json({
      success: true,
      products,
      totalPage,
    });
  }
);
