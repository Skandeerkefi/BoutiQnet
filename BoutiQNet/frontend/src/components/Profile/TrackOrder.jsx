import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
	const { orders } = useSelector((state) => state.order);
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const { id } = useParams();

	useEffect(() => {
		if (user && user._id) {
			dispatch(getAllOrdersOfUser(user._id));
		}
	}, [dispatch, user]);

	const data = orders && orders.find((item) => item._id === id);

	if (!data) {
		return (
			<div className='w-full h-[80vh] flex justify-center items-center'>
				<h1>No order found</h1>
			</div>
		);
	}

	let statusMessage = "";

	switch (data.status) {
		case "Processing":
			statusMessage = "Your Order is processing in shop.";
			break;
		case "Transferred to delivery partner":
			statusMessage = "Your Order is on the way for delivery partner.";
			break;
		case "Shipping":
			statusMessage = "Your Order is on the way with our delivery partner.";
			break;
		case "Received":
			statusMessage =
				"Your Order is in your city. Our Delivery man will deliver it.";
			break;
		case "On the way":
			statusMessage = "Our Delivery man is going to deliver your order.";
			break;
		case "Delivered":
			statusMessage = "Your order is delivered!";
			break;
		case "Processing refund":
			statusMessage = "Your refund is processing!";
			break;
		case "Refund Success":
			statusMessage = "Your Refund is success!";
			break;
		default:
			statusMessage = "Unknown status";
			break;
	}

	return (
		<div className='w-full h-[80vh] flex justify-center items-center'>
			<h1 className='text-[20px]'>{statusMessage}</h1>
		</div>
	);
};

export default TrackOrder;
