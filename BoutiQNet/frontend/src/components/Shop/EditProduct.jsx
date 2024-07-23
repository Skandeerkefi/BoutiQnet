import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct, getProductById } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import Swal from "sweetalert2";

const EditProduct = () => {
	const { id } = useParams();
	const { seller } = useSelector((state) => state.seller);
	const { success, error, product } = useSelector((state) => state.products);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [tags, setTags] = useState("");
	const [originalPrice, setOriginalPrice] = useState("");
	const [discountPrice, setDiscountPrice] = useState("");
	const [stock, setStock] = useState("");
	const [images, setImages] = useState([]);

	useEffect(() => {
		dispatch(getProductById(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (product) {
			setName(product.name || "");
			setDescription(product.description || "");
			setCategory(product.category || "");
			setTags(product.tags || "");
			setOriginalPrice(product.originalPrice || "");
			setDiscountPrice(product.discountPrice || "");
			setStock(product.stock || "");
			// Assuming product.images is an array of image URLs
			setImages(product.images || []);
		}
	}, [product]);
	useEffect(() => {
		if (success) {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "Product created successfully!",
			}).then(() => {
				navigate("/dashboard");
				window.location.reload();
			});
		}
	}, [dispatch, error, success, navigate]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		// Append images only if new images are uploaded
		if (images.length > 0) {
			images.forEach((image) => {
				formData.append("images", image);
			});
		}
		// Append all fields to the form data
		formData.append("name", name);
		formData.append("description", description);
		formData.append("category", category);
		formData.append("tags", tags);
		formData.append("originalPrice", originalPrice);
		formData.append("discountPrice", discountPrice);
		formData.append("stock", stock);
		formData.append("shopId", seller._id);

		dispatch(updateProduct(id, formData));
	};
	return (
		<div className='w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll'>
			<h5 className='text-[30px] font-Poppins text-center'>Edit Product</h5>
			<form onSubmit={handleSubmit}>
				<br />
				<div>
					<label className='pb-2'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						type='text'
						name='name'
						value={name}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setName(e.target.value)}
						placeholder='Enter your product name...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Description <span className='text-red-500'>*</span>
					</label>
					<textarea
						cols='30'
						required
						rows='8'
						type='text'
						name='description'
						value={description}
						className='mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Enter your product description...'
					></textarea>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Category <span className='text-red-500'>*</span>
					</label>
					<select
						className='w-full mt-2 border h-[35px] rounded-[5px]'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					>
						<option value='Choose a category'>Choose a category</option>
						{categoriesData &&
							categoriesData.map((i) => (
								<option value={i.title} key={i.title}>
									{i.title}
								</option>
							))}
					</select>
				</div>
				<br />
				<div>
					<label className='pb-2'>Tags</label>
					<input
						type='text'
						name='tags'
						value={tags}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setTags(e.target.value)}
						placeholder='Enter your product tags...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>Original Price</label>
					<input
						type='number'
						name='originalPrice'
						value={originalPrice}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setOriginalPrice(e.target.value)}
						placeholder='Enter your product price...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Price (With Discount) <span className='text-red-500'>*</span>
					</label>
					<input
						type='number'
						name='discountPrice'
						value={discountPrice}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setDiscountPrice(e.target.value)}
						placeholder='Enter your product price with discount...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Product Stock <span className='text-red-500'>*</span>
					</label>
					<input
						type='number'
						name='stock'
						value={stock}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setStock(e.target.value)}
						placeholder='Enter your product stock...'
					/>
				</div>

				<div>
					<input
						type='submit'
						value='Update'
						className='mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
					/>
				</div>
			</form>
		</div>
	);
};

export default EditProduct;
