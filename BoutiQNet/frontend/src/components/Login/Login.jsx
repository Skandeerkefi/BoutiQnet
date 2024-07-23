import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { server } from "../../server";
const defaultTheme = createTheme();

const Login = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("test_acc@gmail.com");
	const [password, setPassword] = useState("test_acc");
	const [visible, setVisible] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await axios.post(
				`${server}/user/login-user`,
				{ email, password },
				{ withCredentials: true }
			);

			Swal.fire({
				icon: "success",
				title: "Login Success!",
				showConfirmButton: false,
				timer: 1500,
			}).then(async (res) => {
				navigate("/");
				window.location.reload(true);
			});
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: error.response.data.message,
			});
		}
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Grid container component='main' sx={{ height: "100vh" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={3}
					md={7}
					sx={{
						backgroundImage:
							"url(https://res.cloudinary.com/ddyb6vfje/image/upload/v1715154533/Pink_Minimalist_Mockup_E-Commerce_App_Download_Instagram_Post_1_dzhavs.png)",
						backgroundRepeat: "no-repeat",
						backgroundColor: (t) =>
							t.palette.mode === "light"
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Sign in
						</Typography>
						<Box
							component='form'
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 1 }}
						>
							<TextField
								margin='normal'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								autoFocus
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='password'
								label='Password'
								type={visible ? "text" : "password"}
								id='password'
								autoComplete='current-password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button
								type='submit'
								fullWidth
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item>
									<Link href='/sign-up' variant='body2'>
										<h1>Don't have an account? Sign Up</h1>
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default Login;
