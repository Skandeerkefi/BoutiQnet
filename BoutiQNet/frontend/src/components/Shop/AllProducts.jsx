import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import Swal from "sweetalert2";
const AllProducts = () => {
	const { products, isLoading } = useSelector((state) => state.products);
	const { seller } = useSelector((state) => state.seller);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllProductsShop(seller?._id));
	}, [dispatch, seller?._id]);

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
			cellClassName: "text-green-500 font-medium",
		},
		{
			field: "sold",
			headerName: "Sold out",
			type: "number",
			minWidth: 130,
			flex: 0.6,
			cellClassName: "text-red-500 font-medium",
		},
		{
			field: "createdAt",
			headerName: "Created At",
			minWidth: 150,
			flex: 0.7,
		},
		{
			field: "Preview",
			flex: 0.8,
			minWidth: 100,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				// Ensure params object contains the id property
				return (
					<Link to={`/product/${params.row.id}`}>
						<Button variant='outlined' color='primary'>
							<AiOutlineEye size={20} />
						</Button>
					</Link>
				);
			},
		},
		{
			field: "Edit",
			flex: 0.8,
			minWidth: 120,
			headerName: "",
			type: "number",
			sortable: false,
			renderCell: (params) => {
				// Ensure params object contains the id property
				return (
					<Link to={`/dashboard-editproduct/${params.row.id}`}>
						<Button variant='outlined' color='primary'>
							Edit
						</Button>
					</Link>
				);
			},
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
	];

	const rows = products?.map((item) => ({
		id: item._id,
		name: item.name,
		price: ` ${item.discountPrice} DT`,
		Stock: item.stock,
		sold: item.sold_out,
		createdAt: item?.createdAt.slice(0, 10),
	}));

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className='w-full pt-1 mx-8 mt-10 bg-white'>
					<DataGrid
						rows={rows}
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

export default AllProducts;
