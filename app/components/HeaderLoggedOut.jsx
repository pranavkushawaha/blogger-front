import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import DispatchContext from '../DispatchContext.jsx';
import { Flex, Button, Input, Box } from '@chakra-ui/react';

function HeaderLoggedOut(props) {
	const appDispatch = useContext(DispatchContext);
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const response = await Axios.post('/login', {
				username,
				password,
			});
			if (response.data) {
				appDispatch({ type: 'login', data: response.data });
				appDispatch({
					type: 'flashMessages',
					value: 'You have successfully logged in.',
				});
			} else {
				console.log('There was an error.[:(]');
				appDispatch({
					type: 'flashMessages',
					value: 'Invalid username and password.',
					status: 'error',
				});
			}
		} catch (e) {}
	}
	return (
		<Box display={{ md: 'flex' }} alignItems="center" justifyContent="center">
			<Box m={3}>
				<Input
					size="sm"
					variant="filled"
					onChange={(e) => setUsername(e.target.value)}
					name="username"
					type="text"
					placeholder="Username"
					autoComplete="off"
					// minW={"200px"}

					// width="auto"
					_focus={{
						bg: 'gray.200',
					}}
				/>
			</Box>
			<Box m={3}>
				<Input
					size="sm"
					variant="filled"
					onChange={(e) => setPassword(e.target.value)}
					name="password"
					type="password"
					placeholder="Password"
					// minW={"200px"}

					// width="auto"
					_focus={{
						bg: 'gray.200',
					}}
				/>
			</Box>
			<Box m={3}>
				<Button size="sm" onClick={handleSubmit}>
					Sign In
				</Button>
			</Box>
		</Box>
	);
}

export default HeaderLoggedOut;
