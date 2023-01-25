import React, { useEffect, useContext } from 'react';
import StateContext from '../StateContext.jsx';
import DispatchContext from '../DispatchContext.jsx';
import { Badge, Box, IconButton } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';

function FAB() {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	return (
		<Box position={'fixed'} bottom="50px" right="50px">
			<IconButton
				icon={<ChatIcon />}
				onClick={() => appDispatch({ type: 'toggleChat' })}
				size={'lg'}
				variant="outline"
				aria-label="Chat"
				isRound={1}
				bgColor="primary.100"
				color={'primary.500'}
				position="relative"
				boxShadow={"2px 5px 40px #006fe6"}
			/>
			{Boolean(appState.unreadChatCount) && (
				<Badge
					position={'absolute'}
					right="0px"
					top="-5px"
					borderRadius={'full'}
					colorScheme="red"
                    fontSize={"md"}
				>
					{appState.unreadChatCount > 9 ? "9+" : appState.unreadChatCount} 
				</Badge>
			)}
		</Box>
	);
}

export { FAB };
