import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/style";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import Swal from "sweetalert2"; // Import Swal
import withReactContent from "sweetalert2-react-content"; // Import withReactContent for React integration

const MySwal = withReactContent(Swal); // Create an instance of Swal with React integration

const AllCoupons = () => {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [coupouns, setCoupouns] = useState([]);
	const [minAmount, setMinAmout] = useState("");
	const [maxAmount, setMaxAmount] = useState("");
	const [selectedProducts, setSelectedProducts] = useState("");
	const [value, setValue] = useState("");
	const { seller } = useSelector((state) => state.seller);
	const { products } = useSelector((state) => state.products);

	const dispatch = useDispatch();

	useEffect(() => {
		setIsLoading(true);
		axios
			.get(`${server}/coupon/get-coupon/${seller?._id}`, {
				withCredentials: true,
			})
			.then((res) => {
				setIsLoading(false);
				setCoupouns(res.data.couponCodes);
			})
			.catch((error) => {
				setIsLoading(false);
			});
	}, [dispatch, seller?._id]);

	const handleDelete = async (id) => {
		MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				// If confirmed, proceed with deletion
				axios
					.delete(`${server}/coupon/delete-coupon/${id}`, {
						withCredentials: true,
					})
					.then((res) => {
						MySwal.fire({
							icon: "success",
							title: "Success",
							text: "Coupon code deleted successfully!",
						});
						window.location.reload();
					});
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		await axios
			.post(
				`${server}/coupon/create-coupon-code`,
				{
					name,
					minAmount,
					maxAmount,
					selectedProducts,
					value,
					shopId: seller._id,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				MySwal.fire({
					icon: "success",
					title: "Success",
					text: "Coupon code created successfully!",
				});
				setOpen(false);
				window.location.reload();
			})
			.catch((error) => {
				MySwal.fire({
					icon: "error",
					title: "Error",
					text: error.response.data.message,
				});
			});
	};

	const columns = [
		{
			field: "name",
			headerName: "Coupon Code",
			minWidth: 180,
			flex: 1.4,
		},
		{
			field: "price",
			headerName: "Value",
			minWidth: 100,
			flex: 0.6,
		},
		{
			field: "Delete",
			flex: 0.8,
			minWidth: 120,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Button onClick={() => handleDelete(params.id)}>
							<AiOutlineDelete size={20} />
						</Button>
					</>
				);
			},
		},
	];

	const row = [];

	coupouns &&
		coupouns.forEach((item) => {
			row.push({
				id: item._id,
				name: item.name,
				price: item.value + " %",
				sold: 10,
			});
		});

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className='w-full pt-1 mx-8 mt-10 bg-white'>
					<div className='flex justify-end w-full'>
						<div
							className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
							onClick={() => setOpen(true)}
						>
							<span className='text-white'>Create Coupon Code</span>
						</div>
					</div>
					<DataGrid
						rows={row}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						autoHeight
					/>
					{open && (
						<div className='fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center'>
							<div className='w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4'>
								<div className='flex justify-end w-full'>
									<RxCross1
										size={30}
										className='cursor-pointer'
										onClick={() => setOpen(false)}
									/>
								</div>
								<h5 className='text-[30px] font-Poppins text-center'>
									Create Coupon code
								</h5>
								{/* create coupon code */}
								<form onSubmit={handleSubmit} aria-required={true}>
									<br />
									<div>
										<label className='pb-2'>
											Name <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											name='name'
											required
											value={name}
											className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
											onChange={(e) => setName(e.target.value)}
											placeholder='Enter your coupon code name...'
										/>
									</div>
									<br />
									<div>
										<label className='pb-2'>
											Discount Percentage{" "}
											<span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											name='value'
											value={value}
											required
											className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
											onChange={(e) => setValue(e.target.value)}
											placeholder='Enter your coupon code value...'
										/>
									</div>
									<br />
									<div>
										<label className='pb-2'>Min Amount</label>
										<input
											type='number'
											name='value'
											value={minAmount}
											className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
											onChange={(e) => setMinAmout(e.target.value)}
											placeholder='Enter your coupon code min amount...'
										/>
									</div>
									<br />
									<div>
										<label className='pb-2'>Max Amount</label>
										<input
											type='number'
											name='value'
											value={maxAmount}
											className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
											onChange={(e) => setMaxAmount(e.target.value)}
											placeholder='Enter your coupon code max amount...'
										/>
									</div>
									<br />
									<div>
										<label className='pb-2'>Selected Product</label>
										<select
											className='w-full mt-2 border h-[35px] rounded-[5px]'
											value={selectedProducts}
											onChange={(e) => setSelectedProducts(e.target.value)}
										>
											<option value=''>Choose a selected product</option>{" "}
											{/* Add an initial empty option */}
											{products &&
												products.map((product) => (
													<option value={product.name} key={product._id}>
														{product.name}
													</option>
												))}
										</select>
									</div>
									<br />
									<div>
										<input
											type='submit'
											value='Create'
											className='mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
										/>
									</div>
								</form>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default AllCoupons;
