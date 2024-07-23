import axios from "axios";
import { server } from "../../server";

// create event
export const createevent = (newForm) => async (dispatch) => {
	try {
		dispatch({
			type: "eventCreateRequest",
		});

		const { data } = await axios.post(`${server}/event/create-event`, newForm, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		});
		dispatch({
			type: "eventCreateSuccess",
			payload: data.event,
		});
	} catch (error) {
		dispatch({
			type: "eventCreateFail",
			payload: error.response.data.message,
		});
	}
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "getAlleventsShopRequest",
		});

		const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
		dispatch({
			type: "getAlleventsShopSuccess",
			payload: data.events,
		});
	} catch (error) {
		dispatch({
			type: "getAlleventsShopFailed",
			payload: error.response.data.message,
		});
	}
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "deleteeventRequest",
		});

		const { data } = await axios.delete(
			`${server}/event/delete-shop-event/${id}`,
			{
				withCredentials: true,
			}
		);

		dispatch({
			type: "deleteeventSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deleteeventFailed",
			payload: error.response.data.message,
		});
	}
};

// get all events
export const getAllEvents = () => async (dispatch) => {
	try {
		dispatch({
			type: "getAlleventsRequest",
		});

		const { data } = await axios.get(`${server}/event/get-all-events`);
		dispatch({
			type: "getAlleventsSuccess",
			payload: data.events,
		});
	} catch (error) {
		dispatch({
			type: "getAlleventsFailed",
			payload: error.response.data.message,
		});
	}
};
// Update Event
export const updateEvent = (id, formData) => async (dispatch) => {
	try {
		dispatch({
			type: "updateEventRequest",
		});

		const { data } = await axios.put(
			`${server}/event/update-event/${id}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			}
		);

		dispatch({
			type: "updateEventSuccess",
			payload: data.event,
		});
	} catch (error) {
		dispatch({
			type: "updateEventFailed",
			payload: error.response.data.message,
		});
	}
};

// GET ONE EVENT BY id
export const getEventById = (id) => async (dispatch) => {
	console.log("Fetching event with ID:", id);
	try {
		dispatch({ type: "GET_EVENT_BY_ID_REQUEST" });
		const { data } = await axios.get(`${server}/event/get-event/${id}`);
		console.log("Fetched event data:", data);
		dispatch({ type: "GET_EVENT_BY_ID_SUCCESS", payload: data.event });
	} catch (error) {
		console.error("Error fetching product:", error);
		dispatch({ type: "GET_EVENT_BY_ID_FAILURE", payload: error.message });
	}
};
