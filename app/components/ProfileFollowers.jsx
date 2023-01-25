import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import StateContext from '../StateContext.jsx';
import LoadingDotIcon from './LoadingDotIcon.jsx';

import {
	Card,
	CardBody,
	Text,
	Box,
	List,
	ListItem,
	// Link,
	Divider,
	Stack,
	StackDivider,
	Avatar,
	HStack,
} from '@chakra-ui/react';

function ProfileFollowers() {
	const [isLoading, setIsloading] = useState(true);
	const [posts, setPosts] = useState([]);
	const { username } = useParams();
	const appState = useContext(StateContext);
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/followers`, {
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
				<Stack divider={<StackDivider />}>
					{posts.map((item, index) => {
						return (
							<Link
								key={index}
								to={`/profile/${item.username}`}
							>
								<Card>
									<CardBody>
										<HStack>
											<Avatar
												size="md"
												src={item.avatar}
												name={item.username}
											/>
											<Text fontSize="xl" noOfLines="1">
												{item.username}
											</Text>
										</HStack>
									</CardBody>
								</Card>
							</Link>
						);
					})}
				</Stack>
			</Box>
		);
	}
}

export default ProfileFollowers;
