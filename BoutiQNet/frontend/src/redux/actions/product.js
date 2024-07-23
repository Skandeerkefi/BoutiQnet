import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct = (formData) => async (dispatch) => {
	try {
		dispatch({
			type: "productCreateRequest",
		});

		const { data } = await axios.post(
			`${server}/product/create-product`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			}
		);

		dispatch({
			type: "productCreateSuccess",
			payload: data.product,
		});
	} catch (error) {
		dispatch({
			type: "productCreateFail",
			payload: error.response.data.message,
		});
	}
};
// get all products
export const getAllProducts = () => async (dispatch) => {
	try {
		dispatch({
			type: "getAllProductsRequest",
		});

		const { data } = await axios.get(`${server}/product/get-all-products`);
		dispatch({
			type: "getAllProductsSuccess",
			payload: data.products,
		});
	} catch (error) {
		dispatch({
			type: "getAllProductsFailed",
			payload: error.response.data.message,
		});
	}
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "getAllProductsShopRequest",
		});

		const { data } = await axios.get(
			`${server}/product/get-all-products-shop/${id}`
		);
		dispatch({
			type: "getAllProductsShopSuccess",
			payload: data.products,
		});
	} catch (error) {
		dispatch({
			type: "getAllProductsShopFailed",
			payload: error.response.data.message,
		});
	}
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "deleteProductRequest",
		});

		const { data } = await axios.delete(
			`${server}/product/delete-shop-product/${id}`,
			{
				withCredentials: true,
			}
		);

		dispatch({
			type: "deleteProductSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deleteProductFailed",
			payload: error.response.data.message,
		});
	}
};
// Update product
export const updateProduct = (id, formData) => async (dispatch) => {
	try {
		dispatch({
			type: "updateProductRequest",
		});

		const { data } = await axios.put(
			`${server}/product/update-product/${id}`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
				withCredentials: true,
			}
		);

		dispatch({
			type: "updateProductSuccess",
			payload: data.product,
		});
	} catch (error) {
		dispatch({
			type: "updateProductFailed",
			payload: error.response.data.message,
		});
	}
};
export const getProductById = (id) => async (dispatch) => {
	console.log("Fetching product with ID:", id);
	try {
		dispatch({ type: "GET_PRODUCT_BY_ID_REQUEST" });
		const { data } = await axios.get(`${server}/product/get-product/${id}`);
		console.log("Fetched product data:", data);
		dispatch({ type: "GET_PRODUCT_BY_ID_SUCCESS", payload: data.product });
	} catch (error) {
		console.error("Error fetching product:", error);
		dispatch({ type: "GET_PRODUCT_BY_ID_FAILURE", payload: error.message });
	}
};
