import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import StateContext from '../StateContext.jsx';

import { Flex, Text, Box, Spacer, Container } from '@chakra-ui/react';

// Imported Components---->>
import HeaderLoggedOut from './HeaderLoggedOut.jsx';
import HeaderLoggedIn from './HeaderLoggedIn.jsx';

import { outlineBox } from '../styles.jsx';

// Components----->>
function Header(props) {
	const appState = useContext(StateContext);

	return (
		<Box bg="white" paddingY="1" paddingX={{base:"5%",sm:"10%"}} marginBottom="5" position={'sticky'} top='0' zIndex={'10'}>
			<Box
				display={{ md: 'flex' }}
				justifyContent="space-between"
				alignItems={{ sm: 'center', md: 'justify' }}
				sx={outlineBox}
			>
				<Link to="/">
					<Text paddingLeft="3" fontSize="2xl" as="b" color="#007bff">
						Blogger App
					</Text>
				</Link>
				<Box
					
					display={{ md: 'flex' }}
					alignItems={{ md: 'start' }}
					gap="3"
				>
					{appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
				</Box>
			</Box>
		</Box>
	);
}
export default Header;
