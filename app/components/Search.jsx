import React, { useEffect, useContext } from 'react';
import DispatchContext from '../DispatchContext.jsx';
import { useImmer } from 'use-immer';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {
	Avatar,
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	InputGroup,
	InputLeftElement,
	Input,
	ModalCloseButton,
	Text,
	ModalBody,
	useDisclosure,
	Card,
	CardBody,
	Box,
	Stack,
	StackDivider,
	Image,
} from '@chakra-ui/react';
import LoadingDotIcon from './LoadingDotIcon.jsx';
import { SearchIcon } from '@chakra-ui/icons';
import {muted} from  '../styles.jsx'

function Search() {
	const appDispatch = useContext(DispatchContext);
	const [state, setState] = useImmer({
		searchTerm: '',
		results: [],
		show: 'neither',
		requestCount: 0,
	});

	function handleCloseSearch() {
		appDispatch({ type: 'closeSearch' });
	}
	useEffect(() => {
		document.addEventListener('keyup', searchKeyPressHandler);
		return () => document.removeEventListener('keyup', searchKeyPressHandler);
	}, []);
	useEffect(() => {
		if (state.searchTerm.trim()) {
			setState((draft) => {
				draft.show = 'loading';
			});
			const delay = setTimeout(() => {
				setState((draft) => {
					draft.requestCount++;
				});
			}, 500);
			return () => clearTimeout(delay);
		} else {
			setState((draft) => {
				draft.show = 'neither';
			});
		}
	}, [state.searchTerm]);

	useEffect(() => {
		if (state.requestCount) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResult(params) {
				try {
					const response = await Axios.post(
						'/search',
						{ searchTerm: state.searchTerm },
						{ CancelToken: ourRequest.token }
					);
					setState((draft) => {
						draft.results = response.data;
						draft.show = 'results';
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
	}, [state.requestCount]);

	function searchKeyPressHandler(e) {
		if (e.keyCode == 27) {
			handleCloseSearch();
		}
	}
	function handleInput(e) {
		const value = e.target.value;
		setState((draft) => {
			draft.searchTerm = value.trim();
		});
	}
	return (
		<Modal
			blockScrollOnMount={false}
			isOpen={1}
			onClose={handleCloseSearch}
			size="2xl"
			scrollBehavior="inside"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Text size="md">Search Something...</Text>
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody>
					<Box>
						<InputGroup>
							<InputLeftElement
								pointerEvents="none"
								children={<SearchIcon color="gray.300" />}
							/>
							<Input
								// size="lg"
								w={'100%'}
								onChange={handleInput}
								autoFocus
								type="text"
								autoComplete="off"
								id="live-search-field"
								placeholder="What are you interested in?"
							/>
						</InputGroup>
					</Box>
					{state.show == 'loading' ? <LoadingDotIcon /> : ''}

					{Boolean(state.results.length) && (
						<Box>
							<Box py={4}>
								<Text size={'lg'}>
									Search Results ({state.results.length}{' '}
									{state.results.length > 1 ? 'Items' : 'Item'} found)
								</Text>
							</Box>
							<Stack divider={<StackDivider />}>
								{state.results.map((item) => {
									const date = new Date(item.createdDate);
									const dateFormatted =
										date.getDate() +
										'/' +
										(date.getMonth() + 1) +
										'/' +
										date.getFullYear();
									return (
										<Link
											onClick={handleCloseSearch}
											key={item._id}
											to={`/post/${item._id}`}
										>
											<Card>
												<CardBody>
													<Flex alignItems={'center'} gap={3}>
														<Avatar src={item.author.avatar} />
														<Box>
															<Text noOfLines={3}>
																{item.title}
															</Text>
															<Text sx={muted}>
																Posted by {item.author.username} on {dateFormatted}
															</Text>
														</Box>
													</Flex>
												</CardBody>
											</Card>
										</Link>
									);
								})}
							</Stack>
						</Box>
					)}
					{!Boolean(state.results.length) && state.show == 'results' && (
						<Box py={5}>
							<Image
								mx="auto"
								src="https://media.giphy.com/media/Kfx4WCma0ZdXrDaUUv/giphy.gif"
							/>
							<Text fontSize={'xl'} textAlign="center">
								Sorry, we couldn't find any results for that search.
							</Text>
						</Box>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}

export default Search;
