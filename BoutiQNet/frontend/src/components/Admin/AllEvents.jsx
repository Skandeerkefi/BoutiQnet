import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { deleteEvent } from "../../redux/actions/event";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
const AllEvents = () => {
	const [events, setEvents] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		axios
			.get(`${server}/event/admin-all-events`, { withCredentials: true })
			.then((res) => {
				setEvents(res.data.events);
			});
	}, []);
	const handleDelete = (id) => {
		// Display a swal confirmation dialog
		Swal.fire({
			title: "Are you sure?",
			text: "You will not be able to recover this event!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				// If user confirms, proceed with deletion
				dispatch(deleteEvent(id));
				Swal.fire("Deleted!", "Your event has been deleted.", "success").then(
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
						<Link to={`/product/${params.id}?isEvent=true`}>
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

	events &&
		events.forEach((item) => {
			row.push({
				id: item._id,
				name: item.name,
				price: item.discountPrice + "DT",
				Stock: item.stock,
				sold: item.sold_out,
			});
		});

	return (
		<div className='w-full pt-1 mx-8 mt-10 bg-white'>
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

export default AllEvents;
