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
		<Box bg="white" paddingX={{base:"5%",sm:"10%"}} position={'sticky'} top='0' zIndex={'10'} shadow={'sm'}>
			<Box
				display={{ md: 'flex' }}
				justifyContent="space-between"
				alignItems={{ sm: 'center', md: 'justify' }}
				// sx={outlineBox}
			>
				<Link to="/">
					<Text paddingLeft="2" fontSize="xl"  color="primary.600">
						Blogger App
					</Text>
				</Link>
				<Box>
					{appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
				</Box>
			</Box>
		</Box>
	);
}
export default Header;
