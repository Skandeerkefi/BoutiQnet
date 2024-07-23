const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");

// create product
router.post(
	"/create-product",
	upload.array("images"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.body.shopId;
			const shop = await Shop.findById(shopId);
			if (!shop) {
				return next(new ErrorHandler("Shop Id is invalid!", 400));
			} else {
				const files = req.files;
				const imageUrls = files.map((file) => file.filename);
				const productData = req.body;
				productData.images = imageUrls;
				productData.shop = shop;
				const product = await Product.create(productData);
				res.status(201).json({
					success: true,
					product,
				});
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

router.get(
	"/get-all-products-shop/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const products = await Product.find({ shopId: req.params.id });

			if (!products || products.length === 0) {
				return res.status(404).json({
					success: false,
					message: "No products found for the given shop.",
				});
			}

			res.status(200).json({
				success: true,
				products,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

// Delete products
router.delete(
	"/delete-shop-product/:id",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const product = await Product.findOneAndDelete({ _id: req.params.id });

			if (!product) {
				return next(new ErrorHandler("Product is not found with this id", 404));
			}

			res.status(201).json({
				success: true,
				message: "Product Deleted successfully!",
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

// get all products
router.get(
	"/get-all-products",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const products = await Product.find().sort({ createdAt: -1 });

			res.status(200).json({
				success: true,
				products,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);
// review for a product
router.put(
	"/create-new-review",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { user, rating, comment, productId, orderId } = req.body;

			const product = await Product.findById(productId);

			const review = {
				user,
				rating,
				comment,
				productId,
			};

			const isReviewed = product.reviews.find(
				(rev) => rev.user._id === req.user._id
			);

			if (isReviewed) {
				product.reviews.forEach((rev) => {
					if (rev.user._id === req.user._id) {
						(rev.rating = rating), (rev.comment = comment), (rev.user = user);
					}
				});
			} else {
				product.reviews.push(review);
			}

			let avg = 0;

			product.reviews.forEach((rev) => {
				avg += rev.rating;
			});

			product.ratings = avg / product.reviews.length;

			await product.save({ validateBeforeSave: false });

			await Order.findByIdAndUpdate(
				orderId,
				{ $set: { "cart.$[elem].isReviewed": true } },
				{ arrayFilters: [{ "elem._id": productId }], new: true }
			);

			res.status(200).json({
				success: true,
				message: "Reviwed succesfully!",
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);

// all products --- for admin
router.get(
	"/admin-all-products",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const products = await Product.find().sort({
				createdAt: -1,
			});
			res.status(201).json({
				success: true,
				products,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);

// update product
router.put(
	"/update-product/:productId",
	upload.array("images"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const productId = req.params.productId;
			const product = await Product.findById(productId);
			if (!product) {
				return next(new ErrorHandler("Product not found", 404));
			} else {
				const shopId = req.body.shopId;
				const shop = await Shop.findById(shopId);
				if (!shop) {
					return next(new ErrorHandler("Shop Id is invalid!", 400));
				} else {
					const productData = req.body;
					// Remove the images field from productData
					delete productData.images;
					productData.shop = shop;
					const updatedProduct = await Product.findByIdAndUpdate(
						productId,
						productData,
						{ new: true }
					);
					res.status(200).json({
						success: true,
						product: updatedProduct,
					});
				}
			}
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

// Get a single product by ID
router.get(
	"/get-product/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const id = req.params.id;

			// Find the product by ID
			const product = await Product.findById(id);

			if (!product) {
				return next(new ErrorHandler("Product not found", 404));
			}

			res.status(200).json({
				success: true,
				product,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

module.exports = router;
