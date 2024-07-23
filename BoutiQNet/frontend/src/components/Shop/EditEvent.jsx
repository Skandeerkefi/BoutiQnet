import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateEvent, getEventById } from "../../redux/actions/event";
import { categoriesData } from "../../static/data";
import Swal from "sweetalert2";

const EditEvent = () => {
	const { id } = useParams();
	const { seller } = useSelector((state) => state.seller);
	const { success, error, event } = useSelector((state) => state.events);
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
	const [startDate, setStartDate] = useState(null); 
	const [endDate, setEndDate] = useState(null); 

	useEffect(() => {
		dispatch(getEventById(id));
	}, [dispatch, id]);

	useEffect(() => {
		if (event) {
			setName(event.name || "");
			setDescription(event.description || "");
			setCategory(event.category || "");
			setTags(event.tags || "");
			setOriginalPrice(event.originalPrice || "");
			setDiscountPrice(event.discountPrice || "");
			setStock(event.stock || "");
			setImages(event.images || []);

			// Parse and set start date and end date if available
			if (event.startDate) {
				setStartDate(new Date(event.startDate));
			}
			if (event.endDate) {
				setEndDate(new Date(event.endDate));
			}
		}
	}, [event]);

	const handleStartDateChange = (e) => {
		const startDate = new Date(e.target.value);
		setStartDate(startDate);
	};

	const handleEndDateChange = (e) => {
		const endDate = new Date(e.target.value);
		setEndDate(endDate);
	};
	const today = new Date().toISOString().slice(0, 10);

	const minEndDate = startDate
		? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
				.toISOString()
				.slice(0, 10)
		: "";

	useEffect(() => {
		if (success) {
			Swal.fire({
				icon: "success",
				title: "Success!",
				text: "event updated successfully!",
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
		formData.append("start_Date", startDate.toISOString());
		formData.append("Finish_Date", endDate.toISOString());

		dispatch(updateEvent(id, formData));
	};
	return (
		<div className='w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll'>
			<h5 className='text-[30px] font-Poppins text-center'>Edit Event</h5>
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
						placeholder='Enter your Event name...'
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
						placeholder='Enter your Event description...'
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
						placeholder='Enter your Event tags...'
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
						placeholder='Enter your Event price...'
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
						placeholder='Enter your Event price with discount...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Event Stock <span className='text-red-500'>*</span>
					</label>
					<input
						type='number'
						name='stock'
						value={stock}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={(e) => setStock(e.target.value)}
						placeholder='Enter your Event stock...'
					/>
				</div>
				<div>
					<label className='pb-2'>
						Event Start Date <span className='text-red-500'>*</span>
					</label>
					<input
						type='date'
						name='price'
						id='start-date'
						value={startDate ? startDate.toISOString().slice(0, 10) : ""}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={handleStartDateChange}
						min={today}
						placeholder='Enter your event product stock...'
					/>
				</div>
				<br />
				<div>
					<label className='pb-2'>
						Event End Date <span className='text-red-500'>*</span>
					</label>
					<input
						type='date'
						name='price'
						id='end-date'
						value={endDate ? endDate.toISOString().slice(0, 10) : ""}
						className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
						onChange={handleEndDateChange}
						min={minEndDate}
						placeholder='Enter your event product stock...'
					/>
				</div>
				<br />
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

export default EditEvent;
