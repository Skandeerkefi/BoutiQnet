import { createReducer, createAction } from "@reduxjs/toolkit";

// Action Types
const LoadSellerRequest = createAction("LoadSellerRequest");
const LoadSellerSuccess = createAction("LoadSellerSuccess");
const LoadSellerFail = createAction("LoadSellerFail");
const getAllSellersRequest = createAction("getAllSellersRequest");
const getAllSellersSuccess = createAction("getAllSellersSuccess");
const getAllSellersFailed = createAction("getAllSellersFailed");
const clearErrors = createAction("clearErrors");

// Initial State
const initialState = {
	isLoading: true,
};

// Reducer
export const sellerReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(LoadSellerRequest, (state) => {
			state.isLoading = true;
		})
		.addCase(LoadSellerSuccess, (state, action) => {
			state.isSeller = true;
			state.isLoading = false;
			state.seller = action.payload;
		})
		.addCase(LoadSellerFail, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
			state.isSeller = false;
		})
		.addCase(getAllSellersRequest, (state) => {
			state.isLoading = true;
		})
		.addCase(getAllSellersSuccess, (state, action) => {
			state.isLoading = false;
			state.sellers = action.payload;
		})
		.addCase(getAllSellersFailed, (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		})
		.addCase(clearErrors, (state) => {
			state.error = null;
		});
});
