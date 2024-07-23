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
import { server } from "../../server";
const defaultTheme = createTheme();

const Signup = () => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [avatar, setAvatar] = useState(null);

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		setAvatar(file);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const config = { headers: { "Content-Type": "multipart/form-data" } };

			const newForm = new FormData();

			newForm.append("file", avatar);
			newForm.append("name", name);
			newForm.append("email", email);
			newForm.append("password", password);

			const response = await axios.post(
				`${server}/user/create-user`,
				newForm,
				config
			);
			Swal.fire({
				icon: "success",
				title: "Success",
				text: response.data.message,
				showConfirmButton: false,
				timer: 3000,
			});
			setName("");
			setEmail("");
			setPassword("");
			setAvatar(null);
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
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
					sm={4}
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
							Register as a new user
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
								id='name'
								label='Full Name'
								name='name'
								autoComplete='name'
								autoFocus
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								autoComplete='current-password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<div>
								<label
									htmlFor='avatar'
									className='block text-sm font-medium text-gray-700'
								></label>
								<div className='flex items-center mt-2'>
									<span className='inline-block w-8 h-8 overflow-hidden rounded-full'>
										{avatar ? (
											<img
												src={URL.createObjectURL(avatar)}
												alt='avatar'
												className='object-cover w-full h-full rounded-full'
											/>
										) : (
											<Avatar sx={{ m: 1 }} />
										)}
									</span>
									<label
										htmlFor='file-input'
										className='flex items-center justify-center px-4 py-2 ml-5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50'
									>
										<span>Upload a file</span>
										<input
											type='file'
											name='avatar'
											id='file-input'
											accept='.jpg,.jpeg,.png'
											onChange={handleFileInputChange}
											className='sr-only'
										/>
									</label>
								</div>
							</div>
							<Button
								type='submit'
								fullWidth
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
							>
								Submit
							</Button>
							<Grid container>
								<Grid item>
									<Link href='/login' variant='body2'>
										Already have an account? Sign in
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

export default Signup;
