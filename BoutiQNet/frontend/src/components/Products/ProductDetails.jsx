import React, { useEffect, useState } from "react";
import {
	AiFillHeart,
	AiOutlineHeart,
	AiOutlineMessage,
	AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/style";
import {
	addToWishlist,
	removeFromWishlist,
} from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
import Swal from "sweetalert2";

const ProductDetails = ({ data }) => {
	const { wishlist } = useSelector((state) => state.wishlist);
	const { cart } = useSelector((state) => state.cart);
	const { user, isAuthenticated } = useSelector((state) => state.user);
	const { products } = useSelector((state) => state.products);
	const [count, setCount] = useState(1);
	const [click, setClick] = useState(false);
	const [select, setSelect] = useState(0);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAllProductsShop(data && data?.shop._id));
		if (wishlist && wishlist.find((i) => i._id === data?._id)) {
			setClick(true);
		} else {
			setClick(false);
		}
	}, [data, wishlist]);

	const incrementCount = () => {
		setCount(count + 1);
	};

	const decrementCount = () => {
		if (count > 1) {
			setCount(count - 1);
		}
	};

	const removeFromWishlistHandler = (data) => {
		setClick(!click);
		dispatch(removeFromWishlist(data));
	};

	const addToWishlistHandler = (data) => {
		setClick(!click);
		dispatch(addToWishlist(data));
	};

	const addToCartHandler = (id) => {
		const isItemExists = cart && cart.find((i) => i._id === id);
		if (isItemExists) {
			Swal.fire({
				icon: "error",
				title: "Item already in cart!",
				showConfirmButton: false,
				timer: 1500,
			});
		} else {
			if (data.stock < 1) {
				Swal.fire({
					icon: "error",
					title: "Product stock limited!",
					showConfirmButton: false,
					timer: 1500,
				});
			} else if (data.stock < count) {
				Swal.fire({
					icon: "error",
					title: "Not enough stock!",
					showConfirmButton: false,
					timer: 1500,
				});
			} else {
				const cartData = { ...data, qty: count };
				dispatch(addTocart(cartData));
				Swal.fire({
					icon: "success",
					title: "Item added to cart successfully!",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		}
	};
	const totalReviewsLength =
		products &&
		products.reduce((acc, product) => acc + product.reviews.length, 0);

	const totalRatings =
		products &&
		products.reduce(
			(acc, product) =>
				acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
			0
		);

	const avg = totalRatings / totalReviewsLength || 0;

	const averageRating = avg.toFixed(2);

	const handleMessageSubmit = async () => {
		if (isAuthenticated) {
			const groupTitle = data._id + user._id;
			const userId = user._id;
			const sellerId = data.shop._id;
			await axios
				.post(`${server}/conversation/create-new-conversation`, {
					groupTitle,
					userId,
					sellerId,
				})
				.then((res) => {
					navigate(`/inbox?${res.data.conversation._id}`);
				})
				.catch((error) => {
					toast.error(error.response.data.message);
				});
		} else {
			toast.error("Please login to create a conversation");
		}
	};

	return (
		<div className='bg-white'>
			{data ? (
				<div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
					<div className='w-full py-5'>
						<div className='block w-full 800px:flex'>
							<div className='w-full 800px:w-[50%]'>
								<img
									src={`${backend_url}${data.images && data.images[select]}`}
									alt=''
									className='w-[80%]'
								/>
								<div className='flex w-full'>
									{data &&
										data.images.map((i, index) => (
											<div
												className={`${
													select === 0 ? "border" : "null"
												} cursor-pointer`}
											>
												<img
													src={`${backend_url}${i}`}
													alt=''
													className='h-[200px] overflow-hidden mr-3 mt-3'
													onClick={() => setSelect(index)}
												/>
											</div>
										))}
									<div
										className={`${
											select === 1 ? "border" : "null"
										} cursor-pointer`}
									></div>
								</div>
							</div>
							<div className='w-full 800px:w-[50%] pt-5'>
								<h1 className={`${styles.productTitle}`}>{data.name}</h1>
								<p>{data.description}</p>
								<div className='flex pt-3'>
									<h4 className={`${styles.productDiscountPrice}`}>
										{data.discountPrice}DT
									</h4>
									<h3 className={`${styles.price}`}>
										{data.originalPrice ? data.originalPrice : null}DT
									</h3>
								</div>

								<div className='flex items-center justify-between pr-3 mt-12'>
									<div>
										<button
											className='px-4 py-2 font-bold text-white transition duration-300 ease-in-out rounded-l shadow-lg bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-75'
											onClick={decrementCount}
										>
											-
										</button>
										<span className='bg-gray-200 text-gray-800 font-medium px-4 py-[11px]'>
											{count}
										</span>
										<button
											className='px-4 py-2 font-bold text-white transition duration-300 ease-in-out rounded-l shadow-lg bg-gradient-to-r from-teal-400 to-teal-500 hover:opacity-75'
											onClick={incrementCount}
										>
											+
										</button>
									</div>
									<div>
										{click ? (
											<AiFillHeart
												size={30}
												className='cursor-pointer'
												onClick={() => removeFromWishlistHandler(data)}
												color={click ? "red" : "#333"}
												title='Remove from wishlist'
											/>
										) : (
											<AiOutlineHeart
												size={30}
												className='cursor-pointer'
												onClick={() => addToWishlistHandler(data)}
												color={click ? "red" : "#333"}
												title='Add to wishlist'
											/>
										)}
									</div>
								</div>
								<div
									className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
									onClick={() => addToCartHandler(data._id)}
								>
									<span className='flex items-center text-white'>
										Add to cart <AiOutlineShoppingCart className='ml-1' />
									</span>
								</div>
								<div className='flex items-center pt-8'>
									<Link to={`/shop/preview/${data?.shop._id}`}>
										<img
											src={`${backend_url}${data?.shop?.avatar}`}
											alt=''
											className='w-[50px] h-[50px] rounded-full mr-2'
										/>
									</Link>
									<div className='pr-8'>
										<Link to={`/shop/preview/${data?.shop._id}`}>
											<h3 className={`${styles.shop_name} pb-1 pt-1`}>
												{data.shop.name}
											</h3>
										</Link>
										<h5 className='pb-3 text-[15px]'>
											({averageRating}/5) Ratings
										</h5>
									</div>
									<div
										className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
										onClick={handleMessageSubmit}
									>
										<span className='flex items-center text-white'>
											Send Message <AiOutlineMessage className='ml-1' />
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ProductDetailsInfo
						data={data}
						products={products}
						totalReviewsLength={totalReviewsLength}
						averageRating={averageRating}
					/>
					<br />
					<br />
				</div>
			) : null}
		</div>
	);
};

const ProductDetailsInfo = ({
	data,
	products,
	totalReviewsLength,
	averageRating,
}) => {
	const [active, setActive] = useState(1);

	return (
		<div className='bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded'>
			<div className='flex justify-between w-full pt-10 pb-2 border-b'>
				<div className='relative'>
					<h5
						className={
							"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
						}
						onClick={() => setActive(1)}
					>
						Product Details
					</h5>
					{active === 1 ? (
						<div className={`${styles.active_indicator}`} />
					) : null}
				</div>
				<div className='relative'>
					<h5
						className={
							"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
						}
						onClick={() => setActive(2)}
					>
						Product Reviews
					</h5>
					{active === 2 ? (
						<div className={`${styles.active_indicator}`} />
					) : null}
				</div>
				<div className='relative'>
					<h5
						className={
							"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
						}
						onClick={() => setActive(3)}
					>
						Seller Information
					</h5>
					{active === 3 ? (
						<div className={`${styles.active_indicator}`} />
					) : null}
				</div>
			</div>
			{active === 1 ? (
				<>
					<p className='py-2 text-[18px] leading-8 pb-10 whitespace-pre-line'>
						{data.description}
					</p>
				</>
			) : null}

			{active === 2 ? (
				<div className='w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll'>
					{data &&
						data.reviews.map((item, index) => (
							<div className='flex w-full my-2'>
								<img
									src={`${backend_url}${item.user.avatar}`}
									alt=''
									className='w-[50px] h-[50px] rounded-full'
								/>
								<div className='pl-2 '>
									<div className='flex items-center w-full'>
										<h1 className='font-[500] mr-3'>{item.user.name}</h1>
										<Ratings rating={data?.ratings} />
									</div>
									<p>{item.comment}</p>
								</div>
							</div>
						))}

					<div className='flex justify-center w-full'>
						{data && data.reviews.length === 0 && (
							<h5>No Reviews have for this product!</h5>
						)}
					</div>
				</div>
			) : null}

			{active === 3 && (
				<div className='block w-full p-5 800px:flex'>
					<div className='w-full 800px:w-[50%]'>
						<Link to={`/shop/preview/${data.shop._id}`}>
							<div className='flex items-center'>
								<img
									src={`${backend_url}${data?.shop?.avatar}`}
									className='w-[50px] h-[50px] rounded-full'
									alt=''
								/>
								<div className='pl-3'>
									<h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
									<h5 className='pb-2 text-[15px]'>
										({averageRating}/5) Ratings
									</h5>
								</div>
							</div>
						</Link>
						<p className='pt-2'>{data.shop.description}</p>
					</div>
					<div className='w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end'>
						<div className='text-left'>
							<h5 className='font-[600]'>
								Joined on:{" "}
								<span className='font-[500]'>
									{data.shop?.createdAt?.slice(0, 10)}
								</span>
							</h5>
							<h5 className='font-[600] pt-3'>
								Total Products:{" "}
								<span className='font-[500]'>
									{products && products.length}
								</span>
							</h5>
							<h5 className='font-[600] pt-3'>
								Total Reviews:{" "}
								<span className='font-[500]'>{totalReviewsLength}</span>
							</h5>
							<Link to='/shop/preview/${data?.shop._id}'>
								<div
									className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
								>
									<h4 className='text-white'>Visit Shop</h4>
								</div>
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
