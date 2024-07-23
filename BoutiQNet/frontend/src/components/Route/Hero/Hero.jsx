import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/style";

const Hero = () => {
	return (
		<div
			className={`relative min-h-[70vh] 800px:min-h-[60vh] w-full bg-no-repeat ${styles.noramlFlex}`}
			style={{
				backgroundImage:
					"url(https://res.cloudinary.com/ddyb6vfje/image/upload/v1715640838/Untitled-1_ms8fxz.jpg)",
			}}
		>
			<div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
				<p className='pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]'></p>
				<Link to='/products' className='inline-block'>
					<div
						className={`bg-[#1e3a8a] mt-5 border-5 bg-cover rounded px-3 flex items-center`}
					>
						<FontAwesomeIcon
							icon={faShoppingBag}
							className='text-[#fff] text-[18px] mr-2'
						/>
						<span className='text-[#fff] font-[Poppins] text-[18px]'>
							Shop Now
						</span>
					</div>
				</Link>
			</div>
		</div>
	);
};

export default Hero;
