import React, { useEffect, useContext } from 'react';
import Page from './Page.jsx';
import StateContext from '../StateContext.jsx';
import { useImmer } from 'use-immer';
import LoadingDotIcon from './LoadingDotIcon.jsx';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown.js';
import {
	Box,
	Stack,
	SimpleGrid,
	Card,
	CardHeader,
	Flex,
	Avatar,
	Text,
	CardBody,
	Divider,
} from '@chakra-ui/react';

import { heading, muted, cardHeading } from '../styles.jsx';

function Home() {
	const appState = useContext(StateContext);
	const [state, setState] = useImmer({
		isLoading: true,
		feed: [],
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await Axios.post('/getHomeFeed', {
					token: appState.user.token,
				});
				setState((draft) => {
					draft.feed = response.data;
					draft.isLoading = false;
				});
			} catch (error) {
				console.log('there was a problem..');
			}
		}
		fetchData();
	}, []);

	if (state.isLoading) {
		return <LoadingDotIcon />;
	}

	return (
		<Page title="Your Feed" width="20%">
			{state.feed.length == 0 ? (
				<Stack gap={4} paddingX="10%">
					<Text sx={heading} textAlign="center" fontWeight="regular">
						Hello <Text as="strong">{appState.user.username}</Text>, your feed
						is empty.
					</Text>
					<Text textAlign="center" fontSize="xl">
						Your feed displays the latest posts from the people you follow. If
						you don&rsquo;t have any friends to follow that&rsquo;s okay; you
						can use the &ldquo;Search&rdquo; feature in the top menu bar to find
						content written by people with similar interests and then follow
						them.
					</Text>
				</Stack>
			) : (
				<>
					<Text sx={heading} textAlign="center" fontWeight="regular">
						Hello{' '}
						<Text as="strong" color="primary.500">
							{appState.user.username}
						</Text>
						, The Latest From Those You Follow
					</Text>
					<Box my={10}>
						<SimpleGrid columns={{ base: '1', md: '2' }} spacing={10}>
							{state.feed.map((item) => {
								const date = new Date(item.createdDate);
								const dateFormatted =
									date.getDate() +
									'/' +
									(date.getMonth() + 1) +
									'/' +
									date.getFullYear();
								return (
									<Link
										key={item._id}
										to={`/post/${item._id}`}
										className="list-group-item list-group-item-action"
									>
										<Card w="inherit">
											<CardHeader>
												{/* <Flex spacing="4"> */}
												<Flex
													flex="2"
													gap="4"
													alignItems="center"
													flexWrap="wrap"
												>
													<Avatar
														name={item.author.username}
														src={item.author.avatar}
													/>

													<Box>
														<Text sx={cardHeading} noOfLines={1}>
															{item.author.username}
														</Text>
														<Text sx={{ ...muted }}>
															Posted on {dateFormatted}
														</Text>
													</Box>
												</Flex>
												<Box>
													<Text sx={{ fontSize: '1.5rem' }} color="primary.500">
														{item.title}
													</Text>
												</Box>
												{/* </Flex> */}
											</CardHeader>
											<CardBody>
												<Box
													noOfLines="3"
													sx={{
														img: {
															width: '100%',
															borderRadius: '16px',
															marginBottom: '10px',
															marginTop: '10px',
														},
													}}
												>
													<ReactMarkdown
														// components={ChakraUIRenderer()}
														color="blackAlpha.500"
														disallowedElements={['h1', 'h2', 'h3', 'h4', 'a']}
														children={item.body}
														skipHtml
													/>
												</Box>
											</CardBody>
										</Card>
									</Link>
								);
							})}
						</SimpleGrid>
					</Box>
				</>
			)}
		</Page>
	);
}

export default Home;
