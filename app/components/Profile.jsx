import React, { useEffect, useContext } from 'react';
import Page from './Page.jsx';
import { useParams, NavLink, Routes, Route } from 'react-router-dom';
import withRouter from '../../withRouter.jsx';
import Axios from 'axios';
import StateContext from '../StateContext.jsx';
import ProfilePosts from './ProfilePosts.jsx';
import { useImmer } from 'use-immer';
import ProfileFollowing from './ProfileFollowing.jsx';
import ProfileFollowers from './ProfileFollowers.jsx';
import {
	Avatar,
	Box,
	Stack,
	Text,
	Tabs,
	TabList,
	TabPanel,
	Tab,
	TabPanels,
	Button,
	Flex,
	Divider,
} from '@chakra-ui/react';
import { useState } from 'react';

function Profile() {
	const { username } = useParams();
	const appState = useContext(StateContext);
	const [state, setState] = useImmer({
		followActionLoading: false,
		startFollowingRequestCount: 0,
		stopFollowingRequestCount: 0,
		profileData: {
			isFollowing: false,
			profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
			profileUsername: '...',
			counts: { postCount: '', followerCount: '', followingCount: '' },
		},
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await Axios.post(`/profile/${username}`, {
					token: appState.user.token,
				});
				setState((draft) => {
					draft.profileData = response.data;
				});
			} catch (error) {
				console.log('there was a problem..');
			}
		}
		fetchData();
	}, [username]);

	useEffect(() => {
		if (state.startFollowingRequestCount) {
			setState((draft) => {
				draft.followActionLoading = true;
			});
			async function fetchData() {
				try {
					const response = await Axios.post(
						`/addFollow/${state.profileData.profileUsername}`,
						{ token: appState.user.token }
					);
					setState((draft) => {
						(draft.profileData.isFollowing = true),
							draft.profileData.counts.followerCount++;
						draft.followActionLoading = false;
					});
				} catch (error) {
					console.log('there was a problem..');
				}
			}
			fetchData();
		}
	}, [state.startFollowingRequestCount]);

	useEffect(() => {
		if (state.stopFollowingRequestCount) {
			setState((draft) => {
				draft.followActionLoading = true;
			});
			async function fetchData() {
				try {
					const response = await Axios.post(
						`/removeFollow/${state.profileData.profileUsername}`,
						{ token: appState.user.token }
					);
					setState((draft) => {
						(draft.profileData.isFollowing = false),
							draft.profileData.counts.followerCount--;
						draft.followActionLoading = false;
					});
				} catch (error) {
					console.log('there was a problem..');
				}
			}
			fetchData();
		}
	}, [state.stopFollowingRequestCount]);

	function startFollowing() {
		setState((draft) => {
			draft.startFollowingRequestCount++;
		});
	}

	function stopFollowing() {
		setState((draft) => {
			draft.stopFollowingRequestCount++;
		});
	}

	return (
		<Page title="Profile" width="20%">
			<Stack
				paddingX={5}
				spacing={6}
				mb="5"
				direction={{ base: 'column', md: 'row' }}
				alignItems="center"
			>
				<Avatar
					size={'xl'}
					name={state.profileData.profileUsername}
					src={state.profileData.profileAvatar}
				/>
				<Text fontSize="2xl">{state.profileData.profileUsername}</Text>
				{appState.loggedIn &&
					!state.profileData.isFollowing &&
					appState.user.username != state.profileData.profileUsername &&
					state.profileData.profileUsername != '...' && (
						<Button
							onClick={startFollowing}
							disabled={state.followActionLoading}
							colorScheme="whatsapp"
						>
							Follow
						</Button>
					)}
				{appState.loggedIn &&
					state.profileData.isFollowing &&
					appState.user.username != state.profileData.profileUsername &&
					state.profileData.profileUsername != '...' && (
						<Button
							onClick={stopFollowing}
							disabled={state.followActionLoading}
							colorScheme="red"
						>
							Unfollow
						</Button>
					)}
			</Stack>
			{/* // postCount, followerCount, followingCount */}
			<Tabs variant="soft-rounded">
				<TabList w="100%" paddingX={5}>
					<Flex w={{ base: 'full', md: 'auto' }} justifyContent="space-evenly">
						<Tab
							end
							as = {NavLink}
							to={`/profile/${state.profileData.profileUsername}`}
							// style={({isActive})=> isActive ? handleTabChange(0):undefined}
						>
							Posts: {state.profileData.counts.postCount}
						</Tab>
						<Tab
							end
							as = {NavLink}
							to={`/profile/${state.profileData.profileUsername}/followers`}
							// style={({isActive})=> isActive ? handleTabChange(1):undefined}
							
						>
							Followers: {state.profileData.counts.followerCount}
						</Tab>
						<Tab
							end
							as = {NavLink}
							to={`/profile/${state.profileData.profileUsername}/following`}
							// style={({isActive})=> isActive ? handleTabChange(2):undefined}
						>
							Following: {state.profileData.counts.followingCount}
						</Tab>
					</Flex>
				</TabList>	
				<Box mt={4}>
					<Routes>
						<Route exact path="" element={<ProfilePosts />} />
						<Route exact path="followers" element={<ProfileFollowers />} />
						<Route path="following" element={<ProfileFollowing />} />
					</Routes>
				</Box>
			</Tabs>
		</Page>
	);
}

export default withRouter(Profile);
