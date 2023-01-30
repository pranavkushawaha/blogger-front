import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DispatchContext from '../DispatchContext.jsx';
import StateContext from '../StateContext.jsx';

//
import { Box, Button, Avatar, Flex, IconButton } from '@chakra-ui/react';
import { SearchIcon, Search2Icon } from '@chakra-ui/icons';
import { MdHome } from "react-icons/md";

function HeaderLoggedIn(props) {
	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);
	const navigate = useNavigate();
	function handleClick() {
		appDispatch({ type: 'logout' });
		appDispatch({
			type: 'flashMessages',
			value: 'You have successfully logged out.',
		});
		navigate("/");
	}
	function handleSearchIcon(e) {
		e.preventDefault();
		appState.isSearchOpen
			? appDispatch({ type: 'closeSearch' })
			: appDispatch({ type: 'openSearch' });
	}
	return (
		<Flex
			p="2"
			// direction={{ base: 'column', sm: 'row' }}
			flexWrap={'wrap'}
			gap={{base:"2",sm:"4"}}
			alignItems={'center'}
			justifyContent="flex-start"
			// overflow={'hidden'}
		>
			<Link to="/">
				<Box>
					<IconButton
						size={'sm'}
						icon={<MdHome size={"25px"} />  }
						// isRound="1"
						variant={'outline'}
					/>
				</Box>
			</Link>
			<Box>
				<IconButton
					size={'sm'}
					icon={<SearchIcon/>}
					// isRound="1"
					onClick={handleSearchIcon}
					variant={'outline'}
				/>
			</Box>
			<Link to={`/profile/${appState.user.username}`}>
				<Box>
					<Avatar
						size="sm"
						name={appState.user.username}
						src={appState.user.avatar}
					/>
				</Box>
			</Link>
			<Link to="/create-post">
				<Button colorScheme="whatsapp" size="sm">
					Create Post
				</Button>
			</Link>
			<Button size="sm" onClick={handleClick}>
				Sign out
			</Button>
		</Flex>
	);
}

export default HeaderLoggedIn;
