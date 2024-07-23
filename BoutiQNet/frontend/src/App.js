import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
	LoginPage,
	SignupPage,
	HomePage,
	ProductsPage,
	BestSellingPage,
	EventsPage,
	FAQPage,
	ActivationPage,
	ProductDetailsPage,
	CheckoutPage,
	PaymentPage,
	OrderSuccessPages,
	ProfilePage,
	ShopCreatePage,
	SellerActivationPage,
	ShopLoginPage,
	ShopHomePage,
	OrderDetailsPage,
	TrackOrderPage,
	UserInbox,
} from "./Routes.js";
import {
	ShopDashboardPage,
	ShopCreateProduct,
	ShopAllProducts,
	ShopCreateEvents,
	ShopAllEvents,
	ShopAllCoupouns,
	ShopWithDrawMoneyPage,
	ShopAllRefunds,
	ShopSettingsPage,
	EditProductPage,
	EditEventPage,
	ShopPreviewPage,
	ShopAllOrdersPage,
	ShopOrderDetails,
	ShopInboxPage,
} from "./routes/ShopRoutes";
import {
	AdminDashboardPage,
	AdminDashboardUsers,
	AdminDashboardSellers,
	AdminDashboardOrders,
	AdminDashboardProducts,
	AdminDashboardEvents,
	AdminDashboardWithdraw,
} from "./routes/AdminRoutes";
import Store from "./redux/store";
import { loadSeller, loadUser } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import SellerProtectedRoute from "./routes/ProtectedRoute.js";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { server } from "./server";
import { Elements } from "@stripe/react-stripe-js";
import { getAllProducts } from "./redux/actions/product";
import { getAllEvents } from "./redux/actions/event";
const App = () => {
	const [stripeApikey, setStripeApiKey] = useState("");

	async function getStripeApikey() {
		const { data } = await axios.get(`${server}/payment/stripeapikey`);
		setStripeApiKey(data.stripeApikey);
	}

	useEffect(() => {
		Store.dispatch(loadUser());
		Store.dispatch(loadSeller());
		Store.dispatch(getAllProducts());
		Store.dispatch(getAllEvents());
		getStripeApikey();
	}, []);
	console.log(stripeApikey);
	return (
		<BrowserRouter>
			{stripeApikey && (
				<Elements stripe={loadStripe(stripeApikey)}>
					<Routes>
						<Route
							path='/payment'
							element={
								<ProtectedRoute>
									<PaymentPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</Elements>
			)}

			<Routes>
				<Route path='/login' element={<LoginPage />} />
				<Route path='/sign-up' element={<SignupPage />} />
				<Route
					path='/activation/:activation_token'
					element={<ActivationPage />}
				/>
				<Route path='/shop-create' element={<ShopCreatePage />} />
				<Route path='/shop-login' element={<ShopLoginPage />} />
				<Route
					path='/shop/:id'
					element={
						<SellerProtectedRoute>
							<ShopHomePage />
						</SellerProtectedRoute>
					}
				/>
				<Route path='/shop/preview/:id' element={<ShopPreviewPage />} />
				<Route
					path='/dashboard'
					element={
						<SellerProtectedRoute>
							<ShopDashboardPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/inbox'
					element={
						<ProtectedRoute>
							<UserInbox />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/user/order/:id'
					element={
						<ProtectedRoute>
							<OrderDetailsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/user/track/order/:id'
					element={
						<ProtectedRoute>
							<TrackOrderPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-create-event'
					element={
						<SellerProtectedRoute>
							<ShopCreateEvents />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-events'
					element={
						<SellerProtectedRoute>
							<ShopAllEvents />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-coupouns'
					element={
						<SellerProtectedRoute>
							<ShopAllCoupouns />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-withdraw-money'
					element={
						<SellerProtectedRoute>
							<ShopWithDrawMoneyPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-messages'
					element={
						<SellerProtectedRoute>
							<ShopInboxPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/order/:id'
					element={
						<SellerProtectedRoute>
							<ShopOrderDetails />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-refunds'
					element={
						<SellerProtectedRoute>
							<ShopAllRefunds />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/settings'
					element={
						<SellerProtectedRoute>
							<ShopSettingsPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-create-product'
					element={
						<SellerProtectedRoute>
							<ShopCreateProduct />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-products'
					element={
						<SellerProtectedRoute>
							<ShopAllProducts />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-orders'
					element={
						<SellerProtectedRoute>
							<ShopAllOrdersPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-editproduct/:id'
					element={
						<SellerProtectedRoute>
							<EditProductPage />
						</SellerProtectedRoute>
					}
				/>
				<Route
					path='/dashboard-editevent/:id'
					element={
						<SellerProtectedRoute>
							<EditEventPage />
						</SellerProtectedRoute>
					}
				/>
				<Route path='/' element={<HomePage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='/product/:id' element={<ProductDetailsPage />} />
				<Route
					path='/seller/activation/:activation_token'
					element={<SellerActivationPage />}
				/>
				<Route path='/best-selling' element={<BestSellingPage />} />
				<Route path='/events' element={<EventsPage />} />
				<Route path='/faq' element={<FAQPage />} />
				<Route path='/checkout' element={<CheckoutPage />} />

				<Route path='/order/success' element={<OrderSuccessPages />} />
				{/* Admin Routes */}
				<Route
					path='/admin/dashboard'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardPage />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-users'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardUsers />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-sellers'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardSellers />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-orders'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardOrders />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-products'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardProducts />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-events'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardEvents />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/admin-withdraw-request'
					element={
						<ProtectedAdminRoute>
							<AdminDashboardWithdraw />
						</ProtectedAdminRoute>
					}
				/>
				<Route
					path='/profil'
					element={
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
