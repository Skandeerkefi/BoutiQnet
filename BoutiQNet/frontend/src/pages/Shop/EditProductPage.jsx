import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import EditProduct from "../../components/Shop/EditProduct";

const EditProductPage = () => {
	return (
		<div>
			<DashboardHeader />
			<div className='flex items-center justify-between w-full'>
				<div className='w-[80px] 800px:w-[330px]'>
					<DashboardSideBar active={3} />
				</div>
				<div className='flex justify-center w-full'>
					<EditProduct />
				</div>
			</div>
		</div>
	);
};

export default EditProductPage;
