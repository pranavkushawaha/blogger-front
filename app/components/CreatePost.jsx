import React, { useEffect, useState, useContext } from 'react';
import Page from './Page.jsx';
import Axios from 'axios';
import DispatchContext from '../DispatchContext.jsx';
import StateContext from '../StateContext.jsx';
import withRouter from '../../withRouter.jsx';
import { useNavigate } from 'react-router-dom';
import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	Textarea,
	Input,
	Text,
	Card,
	CardBody,
	CardHeader,
} from '@chakra-ui/react';

function CreatePost(props) {
	const [title, setTitle] = useState();
	const [body, setBody] = useState();
	const [isLoading, setIsloading] = useState(false);
	const appDispatch = useContext(DispatchContext);
	const appState = useContext(StateContext);
	const navigate = useNavigate();
	async function handleSubmit(e) {
		e.preventDefault();
		setIsloading(true);
		try {
			const response = await Axios.post('/create-post', {
				title,
				body,
				token: appState.user.token,
			});
			// Redirect to new post url
			appDispatch({
				type: 'flashMessages',
				value: 'Congrats, you created a new post.',
			});
			setIsloading(false);
			navigate(`/post/${response.data}`);
		} catch (error) {
			console.log(error);
			setIsloading(false);
		}
	}
	return (
		<Page title="Create New Post" width="20%">
			<Card>
				<CardHeader>
				<Text as="b" color={'primary.400'}>
					Markdown Is Supported
				</Text>
				</CardHeader>
				<CardBody>
					<FormControl>
						<FormLabel>Title</FormLabel>
						<Input
							onChange={(e) => setTitle(e.target.value)}
							autoFocus
							name="title"
							id="post-title"
							type="text"
							placeholder=""
							autoComplete="off"
							size="lg"
						/>
						<FormHelperText>Choose a title of your post</FormHelperText>
					</FormControl>
					<FormControl>
						<FormLabel>Content</FormLabel>
						<Textarea
							onChange={(e) => setBody(e.target.value)}
							name="body"
							id="post-body"
							type="text"
							h={300}
						/>
					</FormControl>

					<Button mt={4} isLoading={isLoading}  onClick={handleSubmit} colorScheme="whatsapp">
						Save New Post
					</Button>
				</CardBody>
			</Card>
		</Page>
	);
}

export default withRouter(CreatePost);
