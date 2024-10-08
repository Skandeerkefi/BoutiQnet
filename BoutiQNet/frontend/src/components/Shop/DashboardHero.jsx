import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/style";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Chart from "chart.js/auto";

const DashboardHero = () => {
	const dispatch = useDispatch();
	const { orders } = useSelector((state) => state.order);
	const { seller } = useSelector((state) => state.seller);
	const { products } = useSelector((state) => state.products);

	const [orderChartData, setOrderChartData] = useState(null);
	const [chartInstance, setChartInstance] = useState(null);

	useEffect(() => {
		if (seller?._id) {
			dispatch(getAllOrdersOfShop(seller._id));
			dispatch(getAllProductsShop(seller._id));
		}
	}, [dispatch, seller]);

	useEffect(() => {
		if (orders) {
			const data = generateChartData(orders);
			setOrderChartData(data);
			if (chartInstance) {
				chartInstance.destroy();
			}
			renderChart(data);
		}
	}, [orders]);

	const generateChartData = (orders) => {
		const chartData = {};
		orders.forEach((order) => {
			const createdAt = new Date(order.createdAt).toDateString();
			if (chartData[createdAt]) {
				chartData[createdAt]++;
			} else {
				chartData[createdAt] = 1;
			}
		});
		return chartData;
	};

	const renderChart = (data) => {
		const ctx = document.getElementById("orderChart");
		const newChartInstance = new Chart(ctx, {
			type: "bar",
			data: {
				labels: Object.keys(data),
				datasets: [
					{
						label: "Number of Orders",
						data: Object.values(data),
						backgroundColor: "rgba(75, 192, 192, 0.2)",
						borderColor: "rgba(75, 192, 192, 1)",
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
		setChartInstance(newChartInstance);
	};

	const availableBalance = seller?.availableBalance.toFixed(2);

	const columns = [
		{ field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
		{
			field: "status",
			headerName: "Status",
			minWidth: 130,
			flex: 0.7,
			cellClassName: (params) => {
				return params.row.status === "Delivered" ? "greenColor" : "redColor";
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
						<Link to={`/dashboard/order/${params.id}`}>
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
				itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
				total: item.totalPrice + "DT ",
				status: item.status,
			});
		});

	return (
		<div className='w-full p-8'>
			<h3 className='text-[22px] font-Poppins pb-2'>Overview</h3>
			<div className='items-center justify-between block w-full 800px:flex'>
				{/* Account Balance */}
				<div className='w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5'>
					<div className='flex items-center'>
						<AiOutlineMoneyCollect
							size={30}
							className='mr-2'
							fill='#00000085'
						/>

						<h3
							className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
						>
							Account Balance :
						</h3>
					</div>
					<h5 className='pt-2 pl-[36px] text-[22px] font-[500]'>
						{availableBalance}DT
					</h5>
				</div>

				{/* All Orders */}
				<div className='w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5'>
					<div className='flex items-center'>
						<MdBorderClear size={30} className='mr-2' fill='#00000085' />
						<h3
							className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
						>
							All Orders
						</h3>
					</div>
					<h5 className='pt-2 pl-[36px] text-[22px] font-[500]'>
						{orders && orders.length}
					</h5>
					<Link to='/dashboard-orders'>
						<h5 className='pt-4 pl-2 text-[#077f9c]'>View Orders</h5>
					</Link>
				</div>

				{/* All Products */}
				<div className='w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5'>
					<div className='flex items-center'>
						<AiOutlineMoneyCollect
							size={30}
							className='mr-2'
							fill='#00000085'
						/>
						<h3
							className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
						>
							All Products
						</h3>
					</div>
					<h5 className='pt-2 pl-[36px] text-[22px] font-[500]'>
						{products && products.length}
					</h5>
					<Link to='/dashboard-products'>
						<h5 className='pt-4 pl-2 text-[#077f9c]'>View Products</h5>
					</Link>
				</div>
			</div>
			<br />
			<div
				className='w-full min-h-[10vh] bg-white shadow rounded mt-8'
				style={{ maxWidth: "500px", height: "300px" }}
			>
				<canvas
					id='orderChart'
					style={{ width: "100%", height: "100%" }}
				></canvas>
			</div>

			<br />
			<h3 className='text-[22px] font-Poppins pb-2'>Latest Orders</h3>
			<div className='w-full min-h-[45vh] bg-white rounded'>
				<DataGrid
					rows={row}
					columns={columns}
					pageSize={10}
					disableSelectionOnClick
					autoHeight
				/>
			</div>
		</div>
	);
};

export default DashboardHero;
