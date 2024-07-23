import React, { useState } from "react";
import {
	AiOutlineArrowRight,
	AiOutlineCamera,
	AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { backend_url } from "../../server";
import styles from "../../styles/style";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
	deleteUserAddress,
	loadUser,
	updatUserAddress,
	updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
	const { user, error, successMessage } = useSelector((state) => state.user);
	const [name, setName] = useState(user && user.name);
	const [email, setEmail] = useState(user && user.email);
	const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
	const [password, setPassword] = useState("");
	const [avatar, setAvatar] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (error) {
			Swal.fire("Error", error, "error");
			dispatch({ type: "clearErrors" });
		}
		if (successMessage) {
			Swal.fire("Success", successMessage, "success");
			dispatch({ type: "clearMessages" });
		}
	}, [error, successMessage]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateUserInformation(name, email, phoneNumber, password));
	};

	const handleImage = async (e) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (reader.readyState === 2) {
				setAvatar(reader.result);
				// Use FormData to send the file to the server
				const formData = new FormData();
				formData.append("image", e.target.files[0]);

				// Send the file to the server
				axios
					.put(
						`${server}/user/update-avatar`,
						formData, // Send FormData instead of a plain object
						{
							withCredentials: true,
							headers: {
								"Content-Type": "multipart/form-data", // Set content type to multipart/form-data
							},
						}
					)
					.then((response) => {
						dispatch(loadUser());
						Swal.fire("Success", "Avatar updated successfully!", "success");
					})
					.catch((error) => {
						Swal.fire("Error", error, "error");
					});
			}
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	return (
		<div className='w-full'>
			{/* profile */}
			{active === 1 && (
				<>
					<div className='flex justify-center w-full'>
						<div className='relative'>
							<img
								src={`${backend_url}${user?.avatar}`}
								className='w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]'
								alt=''
							/>
							<div className='w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]'>
								<input
									type='file'
									id='image'
									className='hidden'
									onChange={handleImage}
								/>
								<label htmlFor='image'>
									<AiOutlineCamera />
								</label>
							</div>
						</div>
					</div>
					<br />
					<br />
					<div className='w-full px-5'>
						<form onSubmit={handleSubmit} required>
							<div className='w-full 800px:flex block pb-3'>
								<div className=' w-[100%] 800px:w-[50%]'>
									<label className='block pb-2'>Full Name</label>
									<input
										type='text'
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className=' w-[100%] 800px:w-[50%]'>
									<label className='block pb-2'>Email Address</label>
									<input
										type='text'
										className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							<div className='w-full 800px:flex block pb-3'>
								<div className=' w-[100%] 800px:w-[50%]'>
									<label className='block pb-2'>Phone Number</label>
									<input
										type='number'
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
									/>
								</div>

								<div className=' w-[100%] 800px:w-[50%]'>
									<label className='block pb-2'>Enter your password</label>
									<input
										type='password'
										className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</div>
							<input
								className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
								required
								value='Update'
								type='submit'
							/>
						</form>
					</div>
				</>
			)}

			{/* order */}
			{active === 2 && (
				<div>
					<AllOrders />
				</div>
			)}

			{/* Refund */}
			{active === 3 && (
				<div>
					<AllRefundOrders />
				</div>
			)}

			{/* Track order */}
			{active === 5 && (
				<div>
					<TrackOrder />
				</div>
			)}

			{/* Change Password */}
			{active === 6 && (
				<div>
					<ChangePassword />
				</div>
			)}

			{/*  user Address */}
			{active === 7 && (
				<div>
					<Address />
				</div>
			)}
		</div>
	);
};

const AllOrders = () => {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllOrdersOfUser(user._id));
	}, [dispatch, user._id]);

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.value === "Delivered" ? "greenColor" : "redColor";
			},
		},
		{
			field: "itemsQty",
			headerName: "Items Qty",
			type: "number",
			minWidth: 130,
			flex: 0.7,
		},

		{
			field: "total",
			headerName: "Total",
			type: "number",
			minWidth: 130,
			flex: 0.8,
		},

		{
			field: " ",
			flex: 1,
			minWidth: 150,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/order/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];

	const row = [];

	orders &&
		orders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.cart.length,
				total: item.totalPrice + "DT ",
				status: item.status,
			});
		});

	return (
		<div className='pl-8 pt-1'>
			<DataGrid
				rows={row}
				columns={columns}
				pageSize={10}
				disableSelectionOnClick
				autoHeight
			/>
		</div>
	);
};

const AllRefundOrders = () => {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllOrdersOfUser(user._id));
	}, [dispatch, user._id]);

	const eligibleOrders =
		orders && orders.filter((item) => item.status === "Processing refund");

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.value === "Delivered" ? "greenColor" : "redColor";
			},
		},
		{
			field: "itemsQty",
			headerName: "Items Qty",
			type: "number",
			minWidth: 130,
			flex: 0.7,
		},

		{
			field: "total",
			headerName: "Total",
			type: "number",
			minWidth: 130,
			flex: 0.8,
		},

		{
			field: " ",
			flex: 1,
			minWidth: 150,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/order/${params.id}`}>
							<Button>
								<AiOutlineArrowRight size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];

	const row = [];

	eligibleOrders &&
		eligibleOrders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.cart.length,
				total: "US$ " + item.totalPrice,
				status: item.status,
			});
		});

	return (
		<div className='pl-8 pt-1'>
			<DataGrid
				rows={row}
				columns={columns}
				pageSize={10}
				autoHeight
				disableSelectionOnClick
			/>
		</div>
	);
};

const TrackOrder = () => {
	const { user } = useSelector((state) => state.user);
	const { orders } = useSelector((state) => state.order);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllOrdersOfUser(user._id));
	}, [dispatch, user._id]);

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.value === "Delivered" ? "greenColor" : "redColor";
			},
		},
		{
			field: "itemsQty",
			headerName: "Items Qty",
			type: "number",
			minWidth: 130,
			flex: 0.7,
		},

		{
			field: "total",
			headerName: "Total",
			type: "number",
			minWidth: 130,
			flex: 0.8,
		},

		{
			field: " ",
			flex: 1,
			minWidth: 150,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/user/track/order/${params.id}`}>
							<Button>
								<MdTrackChanges size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];

	const row = [];

	orders &&
		orders.forEach((item) => {
			row.push({
				id: item._id,
				itemsQty: item.cart.length,
				total: "US$ " + item.totalPrice,
				status: item.status,
			});
		});

	return (
		<div className='pl-8 pt-1'>
			<DataGrid
				rows={row}
				columns={columns}
				pageSize={10}
				disableSelectionOnClick
				autoHeight
			/>
		</div>
	);
};

const ChangePassword = () => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const passwordChangeHandler = async (e) => {
		e.preventDefault();

		await axios
			.put(
				`${server}/user/update-user-password`,
				{ oldPassword, newPassword, confirmPassword },
				{ withCredentials: true }
			)
			.then((res) => {
				Swal.fire({
					icon: "success",
					title: "Password Changed Successfully",
					text: res.data.success,
					showConfirmButton: false,
					timer: 1500,
				});
				setOldPassword("");
				setNewPassword("");
				setConfirmPassword("");
			})
			.catch((error) => {
				Swal.fire({
					icon: "error",
					title: "Password Change Error",
					text: error.response.data.message,
				});
			});
	};
	return (
		<div className='w-full px-5'>
			<h1 className='block text-[25px] text-center font-[600] text-[#000000ba] pb-2'>
				Change Password
			</h1>
			<div className='w-full'>
				<form
					required
					onSubmit={passwordChangeHandler}
					className='flex flex-col items-center'
				>
					<div className=' w-[100%] 800px:w-[50%] mt-5'>
						<label className='block pb-2'>Enter your old password</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</div>
					<div className=' w-[100%] 800px:w-[50%] mt-2'>
						<label className='block pb-2'>Enter your new password</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>
					<div className=' w-[100%] 800px:w-[50%] mt-2'>
						<label className='block pb-2'>Enter your confirm password</label>
						<input
							type='password'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<input
							className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
							required
							value='Update'
							type='submit'
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

const Address = () => {
	const [open, setOpen] = useState(false);
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [zipCode, setZipCode] = useState();
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [addressType, setAddressType] = useState("");
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const addressTypeData = [
		{
			name: "Default",
		},
		{
			name: "Home",
		},
		{
			name: "Office",
		},
	];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (addressType === "" || country === "" || city === "") {
			Swal.fire({
				icon: "error",
				title: "Address Submission Error",
				text: "Please fill all the fields!",
			});
		} else {
			dispatch(
				updatUserAddress(
					country,
					city,
					address1,
					address2,
					zipCode,
					addressType
				)
			);
			Swal.fire({
				icon: "success",
				title: "Address Added Successfully",
				showConfirmButton: false,
				timer: 1500,
			});
			setOpen(false);
			setCountry("");
			setCity("");
			setAddress1("");
			setAddress2("");
			setZipCode(null);
			setAddressType("");
		}
	};

	const handleDelete = (item) => {
		const id = item._id;
		dispatch(deleteUserAddress(id));
	};

	return (
		<div className='w-full px-5'>
			{open && (
				<div className='fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center '>
					<div className='w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll'>
						<div className='w-full flex justify-end p-3'>
							<RxCross1
								size={30}
								className='cursor-pointer'
								onClick={() => setOpen(false)}
							/>
						</div>
						<h1 className='text-center text-[25px] font-Poppins'>
							Add New Address
						</h1>
						<div className='w-full'>
							<form aria-required onSubmit={handleSubmit} className='w-full'>
								<div className='w-full block p-4'>
									<div className='w-full pb-2'>
										<label className='block pb-2'>Country</label>
										<select
											name=''
											id=''
											value={country}
											onChange={(e) => setCountry(e.target.value)}
											className='w-[95%] border h-[40px] rounded-[5px]'
										>
											<option value='' className='block border pb-2'>
												choose your country
											</option>
											{Country &&
												Country.getAllCountries().map((item) => (
													<option
														className='block pb-2'
														key={item.isoCode}
														value={item.isoCode}
													>
														{item.name}
													</option>
												))}
										</select>
									</div>

									<div className='w-full pb-2'>
										<label className='block pb-2'>Choose your City</label>
										<select
											name=''
											id=''
											value={city}
											onChange={(e) => setCity(e.target.value)}
											className='w-[95%] border h-[40px] rounded-[5px]'
										>
											<option value='' className='block border pb-2'>
												choose your city
											</option>
											{State &&
												State.getStatesOfCountry(country).map((item) => (
													<option
														className='block pb-2'
														key={item.isoCode}
														value={item.isoCode}
													>
														{item.name}
													</option>
												))}
										</select>
									</div>

									<div className='w-full pb-2'>
										<label className='block pb-2'>Address Line 1</label>
										<input
											type='text'
											className='w-[95%] border h-[40px] rounded-[5px]'
											required
											value={address1}
											onChange={(e) => setAddress1(e.target.value)}
										/>
									</div>

									<div className='w-full pb-2'>
										<label className='block pb-2'>Address Line 2</label>
										<input
											type='text'
											className='w-[95%] border h-[40px] rounded-[5px]'
											required
											value={address2}
											onChange={(e) => setAddress2(e.target.value)}
										/>
									</div>

									<div className='w-full pb-2'>
										<label className='block pb-2'>Zip code</label>
										<input
											type='number'
											className='w-[95%] border h-[40px] rounded-[5px]'
											required
											value={zipCode}
											onChange={(e) => setZipCode(e.target.value)}
										/>
									</div>

									<div className='w-full pb-2'>
										<label className='block pb-2'>Address Type</label>
										<select
											name=''
											id=''
											value={addressType}
											onChange={(e) => setAddressType(e.target.value)}
											className='w-[95%] border h-[40px] rounded-[5px]'
										>
											<option value='' className='block border pb-2'>
												select Address Type
											</option>
											{addressTypeData.map((item) => (
												<option
													className='block pb-2'
													key={item.name}
													value={item.name}
												>
													{item.name}
												</option>
											))}
										</select>
									</div>

									<input
										className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
										required
										value='Add Address'
										type='submit'
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
			<h1 className='block text-[25px] text-center font-[600] text-[#000000ba] pb-2'>
				User Address
			</h1>
			<div className='w-full'>
				<div className='w-full flex justify-end p-5'>
					<button
						onClick={() => setOpen(true)}
						className='w-[250px] h-[40px] bg-[#0B6CFB] border-[1px] border-[#0B6CFB] text-center text-[#fff] rounded-[3px] mt-8 cursor-pointer'
					>
						Add New Address
					</button>
				</div>
				<div className='w-full px-5'>
					<table className='w-full '>
						<thead className='w-full'>
							<tr className='w-full border-b-2 border-[#0000004a]'>
								<th className='pb-2'>Country</th>
								<th className='pb-2'>City</th>
								<th className='pb-2'>Address Line 1</th>
								<th className='pb-2'>Address Line 2</th>
								<th className='pb-2'>Zip Code</th>
								<th className='pb-2'>Type</th>
								<th className='pb-2'>Action</th>
							</tr>
						</thead>
						<tbody className='w-full'>
							{user &&
								user.addresses &&
								user.addresses.map((item) => (
									<tr className='w-full border-b-2 border-[#0000004a]'>
										<td className='pb-2'>{item.country}</td>
										<td className='pb-2'>{item.city}</td>
										<td className='pb-2'>{item.address1}</td>
										<td className='pb-2'>{item.address2}</td>
										<td className='pb-2'>{item.zipCode}</td>
										<td className='pb-2'>{item.addressType}</td>
										<td className='pb-2'>
											<div className='flex'>
												<button
													className='border-0 bg-transparent'
													onClick={() => handleDelete(item)}
												>
													<AiOutlineDelete size={20} />
												</button>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ProfileContent;
