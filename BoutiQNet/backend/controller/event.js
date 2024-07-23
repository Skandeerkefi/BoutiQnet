const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const router = express.Router();
const fs = require("fs");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create event
router.post(
	"/create-event",
	upload.array("images"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const shopId = req.body.shopId;
			const shop = await Shop.findById(shopId);
			if (!shop) {
				return next(new ErrorHandler("Shop Id is invalid!", 400));
			} else {
				const files = req.files;
				const imageUrls = files.map((file) => `${file.filename}`);
				const productData = req.body;
				productData.images = imageUrls;
				productData.shop = shop;
				const product = await Event.create(productData);
				res.status(201).json({
					success: true,
					product,
				});
			}
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
	try {
		const events = await Event.find();
		res.status(201).json({
			success: true,
			events,
		});
	} catch (error) {
		return next(new ErrorHandler(error, 400));
	}
});

// get all events of a shop
router.get(
	"/get-all-events/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const events = await Event.find({ shopId: req.params.id });

			res.status(201).json({
				success: true,
				events,
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);

// delete event of a shop
router.delete(
	"/delete-shop-event/:id",
	isSeller,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const productId = req.params.id;

			const eventData = await Event.findById(productId);

			eventData.images.forEach((imageUrl) => {
				const filename = imageUrl;
				const filePath = `uploads/${filename}`;

				fs.unlink(filePath, (err) => {
					if (err) {
						console.log(err);
					}
				});
			});

			const event = await Event.findByIdAndDelete(productId);

			if (!event) {
				return next(new ErrorHandler("Event not found with this id!", 500));
			}

			res.status(201).json({
				success: true,
				message: "Event Deleted successfully!",
			});
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);

// update event
router.put(
	"/update-event/:eventId",
	upload.array("images"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const eventId = req.params.eventId;
			const event = await Event.findById(eventId);
			if (!event) {
				return next(new ErrorHandler("Event not found", 404));
			} else {
				const shopId = req.body.shopId;
				const shop = await Shop.findById(shopId);
				if (!shop) {
					return next(new ErrorHandler("Shop Id is invalid!", 400));
				} else {
					const eventData = req.body;
					// Remove the images field from eventData
					delete eventData.images;
					eventData.shop = shop;
					const updatedEvent = await Event.findByIdAndUpdate(
						eventId,
						eventData,
						{ new: true }
					);
					res.status(200).json({
						success: true,
						event: updatedEvent,
					});
				}
			}
		} catch (error) {
			return next(new ErrorHandler(error, 400));
		}
	})
);

// Get a single Event by ID
router.get(
	"/get-event/:id",
	catchAsyncErrors(async (req, res, next) => {
		try {
			const id = req.params.id;

			// Find the Event by ID
			const event = await Event.findById(id);

			if (!Event) {
				return next(new ErrorHandler("Event not found", 404));
			}

			res.status(200).json({
				success: true,
				event,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 400));
		}
	})
);

router.put(
	"/create-new-review",
	isAuthenticated,
	catchAsyncErrors(async (req, res, next) => {
		try {
			const { user, rating, comment, eventId, orderId } = req.body;

			// Check if event exists
			const event = await Event.findById(eventId);
			if (!event) {
				return res
					.status(404)
					.json({ success: false, message: "Event not found" });
			}

			const review = {
				user,
				rating,
				comment,
				eventId,
			};

			const isReviewed = event.reviews.find(
				(rev) => rev.user._id === req.user._id
			);

			if (isReviewed) {
				event.reviews.forEach((rev) => {
					if (rev.user._id === req.user._id) {
						(rev.rating = rating), (rev.comment = comment), (rev.user = user);
					}
				});
			} else {
				event.reviews.push(review);
			}

			let avg = 0;

			event.reviews.forEach((rev) => {
				avg += rev.rating;
			});

			event.ratings = avg / event.reviews.length;

			await event.save({ validateBeforeSave: false });

			await Order.findByIdAndUpdate(
				orderId,
				{ $set: { "cart.$[elem].isReviewed": true } },
				{ arrayFilters: [{ "elem._id": eventId }], new: true }
			);

			res.status(200).json({
				success: true,
				message: "Reviewed successfully!",
			});
		} catch (error) {
			// Handle errors
			console.error("Error in creating review:", error);
			return next(new ErrorHandler(error, 400));
		}
	})
);

// all events --- for admin
router.get(
	"/admin-all-events",
	isAuthenticated,
	isAdmin("Admin"),
	catchAsyncErrors(async (req, res, next) => {
		try {
			const events = await Event.find().sort({
				createdAt: -1,
			});
			res.status(201).json({
				success: true,
				events,
			});
		} catch (error) {
			return next(new ErrorHandler(error.message, 500));
		}
	})
);
module.exports = router;
