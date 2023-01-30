import React, { useEffect, useContext } from 'react';
import Page from './Page.jsx';
import { useImmerReducer } from 'use-immer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import LoadingDotIcon from './LoadingDotIcon.jsx';
import StateContext from '../StateContext.jsx';
import DispatchContext from '../DispatchContext.jsx';
import NotFound from './NotFound.jsx';
import withRouter from '../../withRouter.jsx';

import {
	Box,
	Button,
	FormControl,
	FormErrorIcon,
	FormErrorMessage,
	FormLabel,
	Input,
	Text,
	Textarea,
	Stack,
	Flex,
	Spacer,
	Card,
	CardBody,
	CardHeader,
	Skeleton,
	SkeletonText,
} from '@chakra-ui/react';

function EditPost(props) {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const navigate = useNavigate();
	const initialState = {
		title: {
			value: '',
			hasError: false,
			message: '',
		},
		body: {
			value: '',
			hasError: false,
			message: '',
		},
		isFetching: true,
		isSaving: false,
		sendCount: 0,
		id: useParams().id,
		notFound: false,
	};

	function ourReducer(draft, action) {
		switch (action.type) {
			case 'fetchComplete':
				draft.title.value = action.value.title;
				draft.body.value = action.value.body;
				draft.isFetching = false;
				break;
			case 'titleChange':
				draft.title.value = action.value;
				break;
			case 'bodyChange':
				draft.body.value = action.value;
				break;
			// case 'submitUpdate':

			//   break
			case 'saveRequestStarted':
				draft.isSaving = true;
				break;
			case 'saveRequestFinished':
				draft.isSaving = false;
				break;
			case 'titleRules':
				if (!action.value.trim()) {
					draft.title.hasError = true;
					draft.title.message = 'You must provide a title.';
				}
				break;
			case 'bodyRules':
				if (!action.value.trim()) {
					draft.body.hasError = true;
					draft.body.message = 'You must provide a body content.';
				}
				break;
			case 'notFound':
				draft.notFound = true;
			default:
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${state.id}`, {
					cancelToken: ourRequest.token,
				});
				if (response.data) {
					dispatch({ type: 'fetchComplete', value: response.data });
					if (appState.user.username != response.data.author.username) {
						appDispatch({
							type: 'flashMessage',
							value: 'You do not have permission to edit that post.',
						});
						navigate('/');
					}
				} else {
					dispatch({ type: 'notFound' });
				}
			} catch (e) {
				console.log('There was a problem.');
			}
		}
		fetchPost();
		return () => {
			ourRequest.cancel();
		};
	}, []);

	function handleSubmit(e) {
		e.preventDefault();
		dispatch({ type: 'bodyRules', value: state.body.value });
		dispatch({ type: 'titleRules', value: state.title.value });
		if (!state.title.hasError && !state.body.hasError) {
			dispatch({ type: 'saveRequestStarted' });
			async function fetchPost() {
				try {
					const response = await Axios.post(`/post/${state.id}/edit`, {
						title: state.title.value,
						body: state.body.value,
						token: appState.user.token,
					});
					dispatch({ type: 'fetchComplete', value: response.data });
					dispatch({ type: 'saveRequestFinished' });
				} catch (e) {
					console.log('There was a second problem.' + e);
				} finally {
					appDispatch({
						type: 'flashMessages',
						value: 'Congrats, you successfully updated a post. ',
					});
					navigate(`/post/${state.id}`);
				}
			}
			fetchPost();
		}
	}
	if (state.notFound) {
		return <NotFound />;
	}
	if (state.isFetching)
		return (
			<Page width="20%">
				<Card>
					<CardBody>
						<Stack gap={4}>
							<Skeleton fadeDuration={1} h={'50px'} />
							<Skeleton fadeDuration={1} h={'400px'} />
							<SkeletonText skeletonHeight={3} />
						</Stack>
					</CardBody>
				</Card>
			</Page>
		);
	return (
		<Page title="Edit Post" width="20%">
			<Card>
				<CardHeader>
					<Text as="b" fontSize={'xl'} color={'primary.400'}>
						Edit Post
					</Text>
				</CardHeader>
				<CardBody>
					<FormControl isInvalid={state.title.hasError}>
						<FormLabel>Title</FormLabel>
						<Input
							onBlur={(e) =>
								dispatch({ type: 'titleRules', value: e.target.value })
							}
							onChange={(e) =>
								dispatch({ type: 'titleChange', value: e.target.value })
							}
							defaultValue={state.title.value}
							autoFocus
							name="title"
							id="post-title"
							className="form-control form-control-lg form-control-title"
							type="text"
							placeholder=""
							autoComplete="off"
							size="lg"
						/>
						{state.title.hasError && (
							<FormErrorMessage>
								<FormErrorIcon />
								{state.title.message}
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={state.body.hasError}>
						<FormLabel>Content</FormLabel>
						<Textarea
							onBlur={(e) =>
								dispatch({ type: 'bodyRules', value: e.target.value })
							}
							onChange={(e) =>
								dispatch({ type: 'bodyChange', value: e.target.value })
							}
							defaultValue={state.body.value}
							name="body"
							id="post-body"
							className="body-content tall-textarea form-control"
							type="text"
							h={300}
						/>
						{state.body.hasError && (
							<FormErrorMessage>
								<FormErrorIcon />
								{state.body.message}
							</FormErrorMessage>
						)}
					</FormControl>
					<Stack
						direction={{ base: 'column', sm: 'row' }}
						gap={4}
						py={4}
						// justifyContent={'s'}
					>
						<Button
							onClick={handleSubmit}
							isLoading={state.isSaving}
							colorScheme="whatsapp"
						>
							Save Update
						</Button>
						<Link to={`/post/${state.id}`}>
							<Button>&laquo; Back to post permalink</Button>
						</Link>
					</Stack>
				</CardBody>
			</Card>
		</Page>
	);
}

export default withRouter(EditPost);

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "fjlsakjljflajklsdjaljfalkjaljflajklf"
// createdDate: "2020-06-12T06:57:02.618Z"
// isVisitorOwner: false
// title: "jfslfjla"
// _id: "5ee3273eb05a2d29acf076b9"
