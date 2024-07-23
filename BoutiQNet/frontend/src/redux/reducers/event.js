import { createReducer } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	success: false,
	event: null,
	events: [],
	allEvents: [],
	error: null,
	message: "",
};

export const eventReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("eventCreateRequest", (state) => {
			state.isLoading = true;
			state.success = false; // Reset success state
			state.error = null; // Reset error state
		})
		.addCase("eventCreateSuccess", (state, action) => {
			state.isLoading = false;
			state.event = action.payload;
			state.success = true;
		})
		.addCase("eventCreateFail", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.success = false;
		})
		.addCase("getAlleventsShopRequest", (state) => {
			state.isLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("getAlleventsShopSuccess", (state, action) => {
			state.isLoading = false;
			state.events = action.payload;
		})
		.addCase("getAlleventsShopFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("deleteeventRequest", (state) => {
			state.isLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("deleteeventSuccess", (state, action) => {
			state.isLoading = false;
			state.message = action.payload;
		})
		.addCase("deleteeventFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("getAlleventsRequest", (state) => {
			state.isLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("getAlleventsSuccess", (state, action) => {
			state.isLoading = false;
			state.allEvents = action.payload;
		})
		.addCase("getAlleventsFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("clearErrors", (state) => {
			state.error = null;
		})
		.addCase("GET_EVENT_BY_ID_REQUEST", (state) => {
			state.isLoading = true;
		})
		.addCase("GET_EVENT_BY_ID_SUCCESS", (state, action) => {
			state.isLoading = false;
			state.event = action.payload;
		})
		.addCase("GET_EVENT_BY_ID_FAILURE", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("updateEventRequest", (state) => {
			state.isLoading = true;
		})
		.addCase("updateEventSuccess", (state, action) => {
			state.isLoading = false;
			state.event = action.payload;
			state.success = true;
		})
		.addCase("updateEventFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.success = false;
		});
});
