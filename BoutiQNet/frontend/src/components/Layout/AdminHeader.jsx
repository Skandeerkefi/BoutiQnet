import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";

const AdminHeader = () => {
	const { user } = useSelector((state) => state.user);

	return (
		<div className='w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4'>
			<div>
				<Link to='/'>
					<img
						src='https://upcdn.io/kW15c2D/raw/boutiqneeet-removebg-preview%20(2).png'
						alt=''
						style={{ width: "250px" }}
					/>
				</Link>
			</div>
			<div className='flex items-center'>
				<div className='flex items-center mr-4'>
					<Link to='/dashboard/cupouns' className='hidden 800px:block'>
						<AiOutlineGift
							color='#555'
							size={30}
							className='mx-5 cursor-pointer'
						/>
					</Link>
					<Link to='/dashboard-events' className='hidden 800px:block'>
						<MdOutlineLocalOffer
							color='#555'
							size={30}
							className='mx-5 cursor-pointer'
						/>
					</Link>
					<Link to='/dashboard-products' className='hidden 800px:block'>
						<FiShoppingBag
							color='#555'
							size={30}
							className='mx-5 cursor-pointer'
						/>
					</Link>
					<Link to='/dashboard-orders' className='hidden 800px:block'>
						<FiPackage color='#555' size={30} className='mx-5 cursor-pointer' />
					</Link>
					<Link to='/dashboard-messages' className='hidden 800px:block'>
						<BiMessageSquareDetail
							color='#555'
							size={30}
							className='mx-5 cursor-pointer'
						/>
					</Link>
					<Link to='/profil'>
						<img
							src={`${backend_url}${user?.avatar}`}
							alt=''
							className='w-[50px] h-[50px] rounded-full object-cover cursor-pointer'
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AdminHeader;
