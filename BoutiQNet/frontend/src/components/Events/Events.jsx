import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/style";
import EventCard from "./EventCard";

const Events = () => {
	const { allEvents, isLoading } = useSelector((state) => state.events);
	const [currentEventIndex, setCurrentEventIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentEventIndex((prevIndex) => (prevIndex + 1) % allEvents.length);
		}, 5000); // Adjust the interval time (in milliseconds) as needed

		return () => clearInterval(interval); // Cleanup function to clear the interval when the component unmounts or when allEvents changes
	}, [allEvents]);

	const handleNextEvent = () => {
		setCurrentEventIndex((prevIndex) => (prevIndex + 1) % allEvents.length);
	};

	const handlePrevEvent = () => {
		setCurrentEventIndex((prevIndex) =>
			prevIndex === 0 ? allEvents.length - 1 : prevIndex - 1
		);
	};

	return (
		<div>
			{!isLoading && (
				<div className={`${styles.section}`}>
					<div className={`${styles.heading}`}>
						<h1>Popular Events</h1>
					</div>

					<div className='w-full grid'>
						{allEvents.length !== 0 ? (
							<>
								<div className='relative'>
									<button
										className='absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 px-2 py-1 rounded-full'
										onClick={handlePrevEvent}
									>
										&lt;
									</button>
									<button
										className='absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 px-2 py-1 rounded-full'
										onClick={handleNextEvent}
									>
										&gt;
									</button>
									<EventCard data={allEvents[currentEventIndex]} />
								</div>
							</>
						) : (
							<h4>No Events available!</h4>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Events;
