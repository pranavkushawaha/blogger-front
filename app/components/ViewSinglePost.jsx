import React, { useEffect, useState, useContext } from 'react';
import Page from './Page.jsx';
import { useParams, Link, useNavigate } from 'react-router-dom';
import withRouter from '../../withRouter.jsx';
import Axios from 'axios';
import LoadingDotIcon from './LoadingDotIcon.jsx';
import ReactMarkdown from 'react-markdown';
import NotFound from './NotFound.jsx';
import StateContext from '../StateContext.jsx';
import DispatchContext from '../DispatchContext.jsx';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Flex,
	Heading,
	Text,
	Spacer,
	IconButton,
	Stack,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	useDisclosure,
	Button,
	AlertDialogContent,
	Card,
} from '@chakra-ui/react';

import { muted, outlineBox, postHeading } from '../styles.jsx';

const newTheme = {
	p: (props) => {
		const { children } = props;
		return (
			<Text lineHeight={'1.5'} fontSize="1.1rem">
				{children}
			</Text>
		);
	},
};

function ViewSinglePost(props) {
	const appState = useContext(StateContext);
	const appDispatch = useContext(DispatchContext);
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsloading] = useState(true);
	const [post, setPost] = useState({});
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();
		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, {
					cancelToken: ourRequest.token,
				});
				setPost(response.data);
				setIsloading(false);
				// console.log(response.data.isVisitorOwner);
			} catch (e) {
				console.log('There was a problem.');
			}
		}
		fetchPost();

		return () => {
			ourRequest.cancel();
		};
	}, [id]);
	const date = new Date(post.createdDate);
	const dateFormatted =
		date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	function isOwner() {
		if (appState.user.username == post.author.username) {
			return true;
		} else {
			return false;
		}
	}
	async function deleteHandler() {
		// const areYouSure = window.confirm(
		// 	'Do you really want to delete this post.'
		// );
		// if (areYouSure) {

		// }
		try {
			const response = await Axios.delete(`/post/${id}`, {
				data: { token: appState.user.token },
			});
			if (response.data == 'Success') {
				appDispatch({
					type: 'flashMessages',
					value: 'Post was successfully deleted.',
				});
				navigate(`/profile/${appState.user.username}`);
			}
		} catch (e) {
			console.log(e);
		}
	}
	if (!isLoading && !post) {
		return <NotFound />;
	}
	if (isLoading)
		return (
			<div>
				<LoadingDotIcon />
			</div>
		);
	return (
		<Page title={post.title} width="20%">
			<Box minH={'60vh'}>
				<Card p={6} my={4}>
					<AlertDialog
						isOpen={isOpen}
						leastDestructiveRef={cancelRef}
						onClose={onClose}
					>
						<AlertDialogOverlay>
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">
									Delete Post
								</AlertDialogHeader>

								<AlertDialogBody>
									Do you really want to delete this post ?
								</AlertDialogBody>

								<AlertDialogFooter>
									<Button onClick={onClose}>Cancel</Button>
									<Button colorScheme="red" onClick={deleteHandler} ml={3}>
										Delete
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
					<Flex pb={3} justifyContent="space-between" alignItems={'baseline'}>
						<Text sx={postHeading} lineHeight={'1.2'}>
							{post.title}
						</Text>
						{isOwner() && (
							<Stack sx={outlineBox} direction={{ base: 'column', md: 'row' }}>
								<Link
									to={`/post/${post._id}/edit`}
									data-tip="Edit"
									data-for="edit"
								>
									<IconButton icon={<EditIcon />} variant="outline" />
								</Link>
								<IconButton
									onClick={onOpen}
									variant="outline"
									data-tip="Delete"
									data-for="delete"
									icon={<DeleteIcon />}
								/>
							</Stack>
						)}
					</Flex>
					<Flex alignItems="center" gap={2}>
						<Link to={`/profile/${post.author.username}`}>
							<Avatar
								size="md"
								name={post.author.username}
								src={post.author.avatar}
							/>
						</Link>
						<Text sx={muted}>
							Posted by{' '}
							<Link
								to={`/profile/${post.author.username}`}
								style={{ color: '#006fe6', textDecoration: 'underline' }}
							>
								{isOwner() ? 'You' : post.author.username}
							</Link>{' '}
							on {dateFormatted}
						</Text>
					</Flex>
					<Box
						py={4}
						sx={{
							img: {
								width: '100%',
								borderRadius:"16px",
								marginBottom:"10px",
								marginTop:"10px",
							},
						}}
						ref={cancelRef}
					>
						<ReactMarkdown
							components={ChakraUIRenderer(newTheme)}
							children={post.body}
							skipHtml
						/>
					</Box>
				</Card>
			</Box>
		</Page>
	);
}

export default withRouter(ViewSinglePost);

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "fjlsakjljflajklsdjaljfalkjaljflajklf"
// createdDate: "2020-06-12T06:57:02.618Z"
// isVisitorOwner: false
// title: "jfslfjla"
// _id: "5ee3273eb05a2d29acf076b9"
