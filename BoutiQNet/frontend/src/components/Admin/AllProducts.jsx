import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct } from "../../redux/actions/product";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import Swal from "sweetalert2";
const AllProducts = () => {
	const [data, setData] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		axios
			.get(`${server}/product/admin-all-products`, { withCredentials: true })
			.then((res) => {
				setData(res.data.products);
			});
	}, []);
	const handleDelete = (id) => {
		// Show SweetAlert confirmation dialog
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				// If user confirms, dispatch the delete action
				dispatch(deleteProduct(id));
				// Show success message
				Swal.fire("Deleted!", "Your product has been deleted.", "success").then(
					() => {
						// Reload the page after deletion
						window.location.reload();
					}
				);
			}
		});
	};

	const columns = [
		{ field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
		{
			field: "name",
			headerName: "Name",
			minWidth: 180,
			flex: 1.4,
		},
		{
			field: "price",
			headerName: "Price",
			minWidth: 100,
			flex: 0.6,
		},
		{
			field: "Stock",
			headerName: "Stock",
			type: "number",
			minWidth: 80,
			flex: 0.5,
		},

		{
			field: "sold",
			headerName: "Sold out",
			type: "number",
			minWidth: 130,
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
				// Ensure params object contains the id property
				return (
					<Button
						variant='outlined'
						color='secondary'
						onClick={() => handleDelete(params.row.id)}
					>
						<AiOutlineDelete size={20} />
					</Button>
				);
			},
		},
		{
			field: "Preview",
			flex: 0.8,
			minWidth: 100,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				return (
					<>
						<Link to={`/product/${params.id}`}>
							<Button>
								<AiOutlineEye size={20} />
							</Button>
						</Link>
					</>
				);
			},
		},
	];

	const row = [];

	data &&
		data.forEach((item) => {
			row.push({
				id: item._id,
				name: item.name,
				price: item.discountPrice + "DT",
				Stock: item.stock,
				sold: item?.sold_out,
			});
		});

	return (
		<>
			<div className='w-full pt-1 mx-8 mt-10 bg-white'>
				<DataGrid
					rows={row}
					columns={columns}
					pageSize={10}
					disableSelectionOnClick
					autoHeight
				/>
			</div>
		</>
	);
};

export default AllProducts;
