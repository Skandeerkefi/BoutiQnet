import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import EditEvent from "../../components/Shop/EditEvent.jsx";

const EditEventPage = () => {
	return (
		<div>
			<DashboardHeader />
			<div className='flex items-center justify-between w-full'>
				<div className='w-[80px] 800px:w-[330px]'>
					<DashboardSideBar active={3} />
				</div>
				<div className='flex justify-center w-full'>
					<EditEvent />
				</div>
			</div>
		</div>
	);
};


export default EditEventPage;
