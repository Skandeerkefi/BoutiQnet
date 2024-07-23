import { createReducer } from "@reduxjs/toolkit";

const initialState = {
	isAuthenticated: false,
};
const LoadUserRequest = "LoadUserRequest";
const LoadUserSuccess = "LoadUserSuccess";
const LoadUserFail = "LoadUserFail";
const getAllUsersRequest = "getAllUsersRequest";
const getAllUsersSuccess = "getAllUsersSuccess";
const getAllUsersFailed = "getAllUsersFailed";
export const userReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(LoadUserRequest, (state) => {
			state.loading = true;
		})
		.addCase(LoadUserSuccess, (state, action) => {
			state.isAuthenticated = true;
			state.loading = false;
			state.user = action.payload;
		})
		.addCase(LoadUserFail, (state, action) => {
			state.loading = false;
			state.error = action.payload;
			state.isAuthenticated = false;
		})
		// get all users --- admin
		.addCase(getAllUsersRequest, (state) => {
			state.usersLoading = true;
		})
		.addCase(getAllUsersSuccess, (state, action) => {
			state.usersLoading = false;
			state.users = action.payload;
		})
		.addCase(getAllUsersFailed, (state, action) => {
			state.usersLoading = false;
			state.error = action.payload;
		});
});
