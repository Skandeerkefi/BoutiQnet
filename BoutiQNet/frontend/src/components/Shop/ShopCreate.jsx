import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { server } from "../../server";
import { RxAvatar } from "react-icons/rx";
import styles from "../../styles/style";

const ShopCreate = () => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [avatar, setAvatar] = useState(null);
	const [password, setPassword] = useState("");
	const [visible, setVisible] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("avatar", avatar);
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("address", address);
		formData.append("phoneNumber", phoneNumber);
		formData.append("zipCode", zipCode);

		const config = { headers: { "Content-Type": "multipart/form-data" } };

		axios
			.post(`${server}/shop/create-shop`, formData, config)
			.then((res) => {
				Swal.fire({
					icon: "success",
					title: "Success!",
					text: res.data.message,
				});
				setName("");
				setEmail("");
				setPassword("");
				setAvatar(null);
				setZipCode("");
				setAddress("");
				setPhoneNumber("");
			})
			.catch((error) => {
				Swal.fire({
					icon: "error",
					title: "Error!",
					text: error.response.data.message,
				});
			});
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		setAvatar(file);
	};

	return (
		<div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
					Register as a seller
				</h2>
			</div>
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'
							>
								Shop Name
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='name'
									id='name'
									autoComplete='shop-name'
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='phoneNumber'
								className='block text-sm font-medium text-gray-700'
							>
								Phone Number
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='phoneNumber'
									id='phoneNumber'
									autoComplete='phone-number'
									required
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'
							>
								Email address
							</label>
							<div className='mt-1'>
								<input
									type='email'
									name='email'
									id='email'
									autoComplete='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-gray-700'
							>
								Address
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='address'
									id='address'
									autoComplete='address'
									required
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='zipCode'
								className='block text-sm font-medium text-gray-700'
							>
								Zip Code
							</label>
							<div className='mt-1'>
								<input
									type='text'
									name='zipCode'
									id='zipCode'
									autoComplete='zip-code'
									required
									value={zipCode}
									onChange={(e) => setZipCode(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'
							>
								Password
							</label>
							<div className='mt-1 relative'>
								<input
									type={visible ? "text" : "password"}
									name='password'
									id='password'
									autoComplete='current-password'
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
								/>
								{visible ? (
									<AiOutlineEye
										className='absolute right-2 top-2 cursor-pointer'
										size={25}
										onClick={() => setVisible(false)}
									/>
								) : (
									<AiOutlineEyeInvisible
										className='absolute right-2 top-2 cursor-pointer'
										size={25}
										onClick={() => setVisible(true)}
									/>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor='avatar'
								className='block text-sm font-medium text-gray-700'
							></label>
							<div className='mt-2 flex items-center'>
								<span className='inline-block w-8 h-8 overflow-hidden rounded-full'>
									{avatar ? (
										<img
											src={URL.createObjectURL(avatar)}
											alt='avatar'
											className='object-cover w-full h-full rounded-full'
										/>
									) : (
										<RxAvatar className='w-8 h-8' />
									)}
								</span>
								<label
									htmlFor='file-input'
									className='ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
								>
									<span>Upload a file</span>
									<input
										type='file'
										name='avatar'
										id='file-input'
										onChange={handleFileInputChange}
										className='sr-only'
									/>
								</label>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className='group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
							>
								Submit
							</button>
						</div>
						<div className={`${styles.noramlFlex} w-full`}>
							<h4>Already have an account?</h4>
							<Link to='/shop-login' className='text-blue-600 pl-2'>
								Sign in
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ShopCreate;
