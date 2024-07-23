import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
	const { allEvents, isLoading } = useSelector((state) => state.events);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div>
					<Header activeHeading={4} />
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
							gap: "20px",
						}}
					>
						{allEvents &&
							allEvents.map((event, index) => (
								<EventCard key={index} active={true} data={event} />
							))}
					</div>
				</div>
			)}
		</>
	);
};

export default EventsPage;
