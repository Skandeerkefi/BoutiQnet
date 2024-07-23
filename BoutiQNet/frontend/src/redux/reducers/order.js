import { createReducer } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	adminOrderLoading: false,
	orders: [],
	adminOrders: [],
	error: null,
};

export const orderReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("getAllOrdersUserRequest", (state) => {
			state.isLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("getAllOrdersUserSuccess", (state, action) => {
			state.isLoading = false;
			state.orders = action.payload;
		})
		.addCase("getAllOrdersUserFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("getAllOrdersShopRequest", (state) => {
			state.isLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("getAllOrdersShopSuccess", (state, action) => {
			state.isLoading = false;
			state.orders = action.payload;
		})
		.addCase("getAllOrdersShopFailed", (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase("adminAllOrdersRequest", (state) => {
			state.adminOrderLoading = true;
			state.error = null; // Reset error state
		})
		.addCase("adminAllOrdersSuccess", (state, action) => {
			state.adminOrderLoading = false;
			state.adminOrders = action.payload;
		})
		.addCase("adminAllOrdersFailed", (state, action) => {
			state.adminOrderLoading = false;
			state.error = action.payload;
		})
		.addCase("clearErrors", (state) => {
			state.error = null;
		});
});
