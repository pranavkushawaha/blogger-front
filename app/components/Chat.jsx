import React, { useEffect, useContext, useRef } from 'react';
import StateContext from '../StateContext.jsx';
import DispatchContext from '../DispatchContext.jsx';
import { useImmer } from 'use-immer';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

import {
	Modal,
	Button,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	Input,
	ModalFooter,
	useDisclosure,
	Flex,
	Box,
	Text,
	Avatar,
	Badge,
	Center,
	IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { IoIosSend } from 'react-icons/io';

function Chat() {
	const socket = useRef(null);
	const chatField = useRef(null);
	const chatLog = useRef(null);
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const [state, setState] = useImmer({
		fieldValue: '',
		chatMessages: [],
	});

	useEffect(() => {
		if (appState.isChatOpen) {
			appDispatch({ type: 'clearUnreadChatCount' });
			const timer = setTimeout(()=>{
				chatLog.current?.lastElementChild?.scrollIntoView({behavior: "smooth",block:"start"});
			},1000);
			// console.log("mounted")
		}
	}, [appState.isChatOpen]);

	function handleFieldChange(e) {
		const value = e.target.value;
		setState((draft) => {
			draft.fieldValue = value;
		});
	}

	useEffect(() => {
		socket.current = io(process.env.BACKENDURL);
		socket.current.on('connect', () => {
			// console.log("connected for chat");
		});
		socket.current.on('chatFromServer', (message) => {
			// console.log(message)
			setState((draft) => {
				draft.chatMessages.push(message);
			});
		});
		return () => socket.current.disconnect();
	}, []);

	useEffect(() => {
		let vh = window?.innerHeight * 0.5;
		// if (chatLog.current?.clientHeight > vh)
			chatLog.current?.lastElementChild?.scrollIntoView({behavior: "smooth",block:"end"});
		if (state.chatMessages.length && !appState.isChatOpen) {
			appDispatch({ type: 'incrementUnreadChatCount' });
		}
	}, [state.chatMessages]);

	function handleSubmit(e) {
		e.preventDefault();

		if (state.fieldValue == '') return;
		socket.current.emit('chatFromBrowser', {
			message: state.fieldValue,
			token: appState.user.token,
		});

		setState((draft) => {
			draft.chatMessages.push({
				message: draft.fieldValue,
				username: appState.user.username,
				avatar: appState.user.avatar,
			});
			draft.fieldValue = '';
		});
	}
	return (
		<Modal
			isOpen={appState.isChatOpen}
			placement="right"
			onClose={() => appDispatch({ type: 'toggleChat' })}
			size={'xs'}
			blockScrollOnMount='true'
		>
			<ModalOverlay />
			<ModalContent>
				<Center py={4}>
					<Badge colorScheme="primary">Your messages will show up here.</Badge>
				</Center>
				<ModalCloseButton />
				<Box
					id="chat"
					ref={chatLog}
					// bgColor="blackAlpha.100"
					p={2}
					borderRadius="lg"
					maxH="50vh"
					overflow="auto"
					// overflowY='scroll'
				>
					{state.chatMessages.map((message, index) => {
						if (message.username == appState.user.username) {
							return (
								<Flex
									py={1}
									gap={1}
									key={index}
									justifyContent="flex-end"
									alignItems="start"
								>
									<Box
										p={0.5}
										px={2}
										borderRadius="lg"
										bgColor={'green.200'}
										alignItems="center"
										overflow={'auto'}
									>
										<Text fontSize={'sm'}>{message.message}</Text>
									</Box>
									<Avatar
										size="sm"
										name={message.username}
										src={message.avatar}
									/>
								</Flex>
							);
						} else {
							return (
								<Flex
									py={1}
									gap={1}
									key={index}
									justifyContent="flex-start"
									alignItems="start"
									overflow={'auto'}
								>
									<Link to={`/profile/${message.username}`}>
										<Avatar
											size="sm"
											name={message.username}
											src={message.avatar}
										/>
									</Link>
									<Box
										p={0.5}
										px={2}
										borderRadius="lg"
										bgColor={'blue.100'}
										alignItems="center"
									>
										<Text fontSize={'sm'}>
											<Link to={`/profile/${message.username}`}>
												<Text as="b">{message.username}: </Text>
											</Link>
											{message.message}
										</Text>
									</Box>
								</Flex>
							);
						}
					})}
				</Box>

				{/* </DrawerBody> */}
				{/* <ModalFooter> */}
				<Box p={5}>
					<form onSubmit={handleSubmit} id="chatForm">
						<Flex gap={2}>
							<Input
								ref={chatField}
								onChange={handleFieldChange}
								type="text"
								id="chatField"
								value={state.fieldValue}
								placeholder="Type a message…"
								autoComplete="off"
								autoFocus
								w="100%"
								size="sm"
							/>
							<Box>
								<IconButton type="submit" size="sm" variant="outline" icon={<IoIosSend size={'20'}/>} />
							</Box>
						</Flex>
					</form>
				</Box>
				{/* </ModalFooter> */}
			</ModalContent>
		</Modal>
	);
}

export default Chat;
