import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import StateContext from '../StateContext.jsx';
import LoadingDotIcon from './LoadingDotIcon.jsx';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import {
	Box,
	// Link,
	List,
	ListItem,
	SimpleGrid,
	Card,
	CardHeader,
	Flex,
	Avatar,
	Text,
	CardBody,
	Image,
} from '@chakra-ui/react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown.js';
import { cardHeading, muted } from '../styles.jsx';
('../styles.jsx');

function ProfilePosts() {
	const [isLoading, setIsloading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();
	const appState = useContext(StateContext);
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, {
					token: appState.user.token,
					cancelToken: ourRequest.token,
				});
				setPosts(response.data);
				setIsloading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchPosts();
		return () => {
			ourRequest.cancel();
		};
	}, [username]);
	if (isLoading) {
		return (
			<div>
				<LoadingDotIcon />
			</div>
		);
	} else {
		return (
			<Box>
				<SimpleGrid columns={{ base: '1', md: '2' }} spacing={10}>
					{posts.map((item) => {
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
										<Box>
											<Text sx={{ fontSize: '1.5rem' }} color="primary.600">
												{item.title}
											</Text>
										</Box>
										<Box>
											<Text sx={muted}>Posted on {dateFormatted}</Text>
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
		);
	}
}

export default ProfilePosts;

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "super test."
// createdDate: "2020-06-13T05:14:03.113Z"
// isVisitorOwner: false
// title: "jfljksfslajfsflsjlafjalfsjalkjljf"
// _id: "5ee4609b5502b7128c9e4196"
