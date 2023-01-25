import React, { useEffect, useState, useContext } from 'react';
import Page from './Page.jsx';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import StateContext from '../StateContext.jsx';
import DispatchContext from '../DispatchContext.jsx';

import {
	Box,
	Text,
	Stack,
	Input,
	Flex,
	Button,
	Spacer,
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from '@chakra-ui/react';

function HomeGuest() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	// const [username, setUsername] = useState()
	// const [email, setEmail] = useState()
	// const [password, setPassword] = useState()
	const initialState = {
		username: {
			value: '',
			hasError: false,
			message: '',
			isUnique: false,
			checkCount: 0,
		},
		email: {
			value: '',
			hasError: false,
			message: '',
			isUnique: false,
			checkCount: 0,
		},
		password: {
			value: '',
			hasError: false,
			message: '',
		},
		submitCount: 0,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'usernameImmediately':
				draft.username.hasError = false;
				draft.username.value = action.value;
				if (draft.username.value.length > 30) {
					draft.username.hasError = true;
					draft.username.message = "Username can't exceed 30 characters.";
				}
				if (
					draft.username.value &&
					!/^([a-zA-Z0-9]+)$/.test(draft.username.value)
				) {
					draft.username.hasError = true;
					draft.username.message =
						'Username can only contain letters and numbers.';
				}
				break;
			case 'usernameAfterDelay':
				if (draft.username.value.length < 3) {
					draft.username.hasError = true;
					draft.username.message = 'Username must be 3 character.';
				}
				if (!draft.username.hasError && !action.noRequest) {
					draft.username.checkCount++;
				}
				break;
			case 'usernameUniqueResults':
				if (action.value) {
					draft.username.hasError = true;
					draft.username.message = 'Username not available.';
				} else {
					draft.username.isUnique = true;
				}
				break;
			case 'emailImmediately':
				draft.email.hasError = false;
				draft.email.value = action.value;
				break;
			case 'emailAfterDelay':
				if (!/^\S+@\S+$/.test(draft.email.value)) {
					draft.email.hasError = true;
					draft.email.message = 'You must provide a valid email address.';
				}
				if (!draft.email.hasError && !action.noRequest) {
					draft.email.checkCount++;
				}
				break;
			case 'emailUniqueResults':
				if (action.value) {
					draft.email.hasError = true;
					draft.email.isUnique = false;
					draft.email.message = 'That email is already been used.';
				} else {
					draft.email.isUnique = true;
				}
				break;
			case 'passwordImmediately':
				draft.password.hasError = false;
				draft.password.value = action.value;
				if (draft.password.value.length > 50) {
					draft.password.hasError = true;
					draft.password.message = "Password can't exceed 50 characters.";
				}
				break;
			case 'passwordAfterDelay':
				if (draft.password.value.length < 12) {
					draft.password.hasError = true;
					draft.password.message = 'Password must be atleast 12 characters.';
				}
				break;
			case 'submit':
				if (
					!draft.email.hasError &&
					!draft.username.hasError &&
					!draft.password.hasError &&
					draft.username.isUnique &&
					draft.email.isUnique
				) {
					draft.submitCount++;
				}
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);
	useEffect(() => {
		if (state.username.value) {
			const delay = setTimeout(
				() => dispatch({ type: 'usernameAfterDelay' }),
				800
			);
			return () => clearTimeout(delay);
		}
	}, [state.username.value]);
	useEffect(() => {
		if (state.email.value) {
			const delay = setTimeout(
				() => dispatch({ type: 'emailAfterDelay' }),
				800
			);
			return () => clearTimeout(delay);
		}
	}, [state.email.value]);
	useEffect(() => {
		if (state.password.value) {
			const delay = setTimeout(
				() => dispatch({ type: 'passwordAfterDelay' }),
				800
			);
			return () => clearTimeout(delay);
		}
	}, [state.password.value]);
	useEffect(() => {
		if (state.username.checkCount) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResult(params) {
				try {
					const response = await Axios.post(
						'/doesusernameExist',
						{ username: state.username.value },
						{ CancelToken: ourRequest.token }
					);
					dispatch({ type: 'usernameUniqueResults', value: response.data });
				} catch (e) {
					console.log('there was a problem or request was cancelled.');
				}
			}
			fetchResult();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.username.checkCount]);
	useEffect(() => {
		if (state.email.checkCount) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResult(params) {
				try {
					const response = await Axios.post(
						'/doesEmailExist',
						{ email: state.email.value },
						{ CancelToken: ourRequest.token }
					);
					dispatch({ type: 'emailUniqueResults', value: response.data });
				} catch (e) {
					console.log('there was a problem or request was cancelled.');
				}
			}
			fetchResult();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.email.checkCount]);
	useEffect(() => {
		if (state.submitCount) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResult(params) {
				try {
					console.log('fetching');

					const response = await Axios.post(
						'/register',
						{
							username: state.username.value,
							email: state.email.value,
							password: state.password.value,
						},
						{ CancelToken: ourRequest.token }
					);
					appDispatch({ type: 'login', data: response.data });
					appDispatch({
						type: 'flashMessages',
						value: 'Congrats, Welcome to your new account.',
					});
				} catch (e) {
					console.log('there was a problem or request was cancelled.');
				}
			}
			fetchResult();
			return () => {
				ourRequest.cancel();
			};
		}
	}, [state.submitCount]);
	function handleSubmit(e) {
		e.preventDefault();
		dispatch({ type: 'usernameImmedaitely', value: state.username.value });
		dispatch({
			type: 'usernameAfterDelay',
			value: state.username.value,
			noRequest: true,
		});
		dispatch({ type: 'emailImmedaitely', value: state.email.value });
		dispatch({
			type: 'emailAfterDelay',
			value: state.email.value,
			noRequest: true,
		});
		dispatch({ type: 'passwordImmedaitely', value: state.password.value });
		dispatch({ type: 'passwordAfterDelay', value: state.password.value });
		dispatch({ type: 'submit' });
		console.log('i called');
	}
	return (
		<Page title="Home">
			<Flex
				direction={{ base: 'column', md: 'row' }}
				alignItems="center"
				gap="10"
				justifyContent="space-between"
			>
				<Box w={{ base: '100%', md: '60%' }}>
					{/* <img src="https://img.freepik.com/free-vector/organic-flat-blog-post-illustration-with-people_23-2148955260.jpg?w=826&t=st=1674022571~exp=1674023171~hmac=c8086da372ea5d48eaec0b8d63e78abbbb73ea6e3c909b20880dd1025bb3a61e" /> */}
					<Box>
						<Text fontSize="6xl">Remember Writing ?</Text>
					</Box>
					<Box>
						<Text fontSize="xl">
							Are you sick of short tweets and impersonal “shared” posts that
							are reminiscent of the late 90’s email forwards? We believe
							getting back to actually writing is the key to enjoying the
							internet again.
						</Text>
					</Box>
				</Box>
				<Spacer />
				<Box w={{ base: '100%', md: '40%' }}>
					<Stack gap="2">
						<Box>
							{/* username */}
							<FormControl isInvalid={state.username.hasError}>
								<FormLabel>Username</FormLabel>
								<Input
									id="username-register"
									name="username"
									placeholder="Pick a username"
									autoComplete="off"
									onChange={(e) =>
										dispatch({
											type: 'usernameImmediately',
											value: e.target.value,
										})
									}
									borderColor="gray.300"
								/>
								{!state.username.hasError ? (
									<FormHelperText>
										Enter a unique username of your choice.
									</FormHelperText>
								) : (
									<FormErrorMessage>{state.username.message}</FormErrorMessage>
								)}
							</FormControl>
						</Box>
						<Box>
							{/* email */}
							<FormControl isInvalid={state.email.hasError}>
								<FormLabel>Email</FormLabel>
								<Input
									onChange={(e) =>
										dispatch({
											type: 'emailImmediately',
											value: e.target.value,
										})
									}
									id="email-register"
									name="email"
									type="email"
									placeholder="you@example.com"
									autoComplete="off"
									borderColor="gray.300"
								/>
								{!state.email.hasError ? (
									<FormHelperText>
										Enter the email you'd like to receive the newsletter on.
									</FormHelperText>
								) : (
									<FormErrorMessage>{state.email.message}</FormErrorMessage>
								)}
							</FormControl>
						</Box>
						<Box>
							{/* password */}
							<FormControl isInvalid={state.password.hasError}>
								<FormLabel>Password</FormLabel>
								<Input
									onChange={(e) =>
										dispatch({
											type: 'passwordImmediately',
											value: e.target.value,
										})
									}
									id="password-register"
									name="password"
									type="password"
									placeholder="Create a password"
									borderColor="gray.300"
								/>
								{!state.password.hasError ? (
									<FormHelperText>Enter the 12 letter password.</FormHelperText>
								) : (
									<FormErrorMessage>{state.password.message}</FormErrorMessage>
								)}
							</FormControl>
						</Box>
						<Button type="submit" onClick={handleSubmit}>
							Sign Up for Blogger App
						</Button>
					</Stack>
				</Box>
			</Flex>
		</Page>
	);
}
export default HomeGuest;
