import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/style";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ShopSettings = () => {
	const { seller } = useSelector((state) => state.seller);
	const [avatar, setAvatar] = useState();
	const [name, setName] = useState(seller && seller.name);
	const [description, setDescription] = useState(
		seller && seller.description ? seller.description : ""
	);
	const [address, setAddress] = useState(seller && seller.address);
	const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
	const [zipCode, setZipcode] = useState(seller && seller.zipCode);
	const [confirmationVisible, setConfirmationVisible] = useState(false);

	const dispatch = useDispatch();
	let toast;

	const handleImage = async (e) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (reader.readyState === 2) {
				setAvatar(reader.result);
				const formData = new FormData();
				formData.append("avatar", e.target.files[0]);

				axios
					.put(`${server}/shop/update-shop-avatar`, formData, {
						withCredentials: true,
						headers: {
							"Content-Type": "multipart/form-data",
						},
					})
					.then((response) => {
						dispatch(loadSeller());
						if (toast) {
							toast.show({
								severity: "success",
								summary: "Success",
								detail: "Avatar updated successfully!",
							});
						}
					})
					.catch((error) => {
						if (toast) {
							toast.show({
								severity: "error",
								summary: "Error",
								detail: error.response.data.message,
							});
						}
					});
			}
		};

		reader.readAsDataURL(e.target.files[0]);
	};

	const updateHandler = async (e) => {
		e.preventDefault();
		setConfirmationVisible(true);
	};

	const confirmUpdate = () => {
		axios
			.put(
				`${server}/shop/update-seller-info`,
				{
					name,
					address,
					zipCode,
					phoneNumber,
					description,
				},
				{ withCredentials: true }
			)
			.then((response) => {
				dispatch(loadSeller());
				if (toast) {
					toast.show({
						severity: "success",
						summary: "Success",
						detail: "Avatar updated successfully!",
					});
				}
			})
			.catch((error) => {
				if (toast) {
					toast.show({
						severity: "error",
						summary: "Error",
						detail: error.response.data.message,
					});
				}
			});
		setConfirmationVisible(false);
	};

	const rejectUpdate = () => {
		setConfirmationVisible(false);
	};

	return (
		<div className='flex flex-col items-center w-full min-h-screen'>
			<Toast ref={(el) => (toast = el)} />
			<Dialog
				visible={confirmationVisible}
				onHide={() => setConfirmationVisible(false)}
				header='Confirm Update'
				footer={
					<div>
						<Button
							label='Yes'
							icon='pi pi-check'
							onClick={confirmUpdate}
							autoFocus
						/>
						<Button
							label='No'
							icon='pi pi-times'
							onClick={rejectUpdate}
							className='p-button-secondary'
						/>
					</div>
				}
			>
				<p>Are you sure you want to update shop info?</p>
			</Dialog>
			<div className='flex w-full 800px:w-[80%] flex-col justify-center my-5'>
				<div className='flex items-center justify-center w-full'>
					<div className='relative'>
						<img
							src={`${backend_url}${seller?.avatar}`}
							alt=''
							className='w-[200px] h-[200px] rounded-full cursor-pointer'
						/>
						<div className='w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]'>
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
				<form
					aria-aria-required={true}
					className='flex flex-col items-center'
					onSubmit={updateHandler}
				>
					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<div className='w-full pl-[3%]'>
							<label className='block pb-2'>Shop Name</label>
						</div>
						<input
							type='name'
							placeholder={`${seller.name}`}
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
						/>
					</div>
					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<div className='w-full pl-[3%]'>
							<label className='block pb-2'>Shop description</label>
						</div>
						<input
							type='name'
							placeholder={`${
								seller?.description
									? seller.description
									: "Enter your shop description"
							}`}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
						/>
					</div>
					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<div className='w-full pl-[3%]'>
							<label className='block pb-2'>Shop Address</label>
						</div>
						<input
							type='name'
							placeholder={seller?.address}
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
						/>
					</div>

					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<div className='w-full pl-[3%]'>
							<label className='block pb-2'>Shop Phone Number</label>
						</div>
						<input
							type='number'
							placeholder={seller?.phoneNumber}
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
						/>
					</div>

					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<div className='w-full pl-[3%]'>
							<label className='block pb-2'>Shop Zip Code</label>
						</div>
						<input
							type='number'
							placeholder={seller?.zipCode}
							value={zipCode}
							onChange={(e) => setZipcode(e.target.value)}
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
						/>
					</div>
					<div className='w-[100%] flex items-center flex-col 800px:w-[50%] mt-5'>
						<input
							type='submit'
							value='Update Shop'
							className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
							required
							readOnly
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ShopSettings;
