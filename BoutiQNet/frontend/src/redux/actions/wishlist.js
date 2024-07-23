// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
	console.log("addToWishlist payload:", data); // Log the payload here
	dispatch({
		type: "wishlist/addToWishlist",
		payload: data,
	});

	localStorage.setItem(
		"wishlistItems",
		JSON.stringify(getState().wishlist.wishlist)
	);
	return data;
};

// remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
	dispatch({
		type: "removeFromWishlist",
		payload: data._id,
	});
	localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
	return data;
};
