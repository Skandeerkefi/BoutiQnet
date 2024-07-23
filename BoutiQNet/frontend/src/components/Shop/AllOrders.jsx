import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
	const { orders, isLoading } = useSelector((state) => state.order);
	const { seller } = useSelector((state) => state.seller);

	const dispatch = useDispatch();
	useEffect(() => {
		if (seller?._id) {
			dispatch(getAllOrdersOfShop(seller._id));
		}
	}, [dispatch, seller]);

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				switch (params.value) {
					case "Delivered":
						return "text-green-500 font-medium";
					case "Received":
					case "On the way":
						return "text-blue-500 font-medium";
					case "Processing":
						return "text-red-500 font-medium";
					case "Transferred to delivery partner":
					case "Shipping":
						return "text-orange-500 font-medium";
					default:
						return "";
				}
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
			field: "createdAt",
			headerName: "Created At",
			minWidth: 150,
			flex: 0.7,
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
						<Link to={`/order/${params.id}`}>
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
				createdAt: item?.createdAt.slice(0, 10),
			});
		});

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className='w-full pt-1 mx-8 mt-10 bg-white'>
					<DataGrid
						rows={row}
						columns={columns}
						pageSize={10}
						disableSelectionOnClick
						autoHeight
					/>
				</div>
			)}
		</>
	);
};

export default AllOrders;
