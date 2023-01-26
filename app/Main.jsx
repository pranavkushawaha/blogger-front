import React, { useEffect, Suspense, useRef } from 'react';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { createRoot } from 'react-dom/client';

//chakra ui
import { ChakraProvider, IconButton } from '@chakra-ui/react';
import theme from './theme.jsx'

// import { createStandaloneToast } from '@chakra-ui/toast';

// mongoDb mainUser's password: P1BvrYSzWD62FQaP
import StateContext from './StateContext.jsx';
import DispatchContext from './DispatchContext.jsx';

// ---------------My components' import--------------- //
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Homeguest from './components/HomeGuest.jsx';
import About from './components/About.jsx';
import Terms from './components/Terms.jsx';
import Home from './components/Home.jsx';
const CreatePost = React.lazy(() => import('./components/CreatePost.jsx'));
const ViewSinglePost = React.lazy(() =>
	import('./components/ViewSinglePost.jsx')
);
import FlashMessages from './components/FlashMessages.jsx';
import Profile from './components/Profile.jsx';
import EditPost from './components/EditPost.jsx';
const NotFound = React.lazy(() => import('./components/NotFound.jsx'));
const Search = React.lazy(() => import('./components/Search.jsx'));
const Chat = React.lazy(() => import('./components/Chat.jsx'));
import LoadingDotIcon from './components/LoadingDotIcon.jsx';
import {FAB} from './components/FloatingActionButton.jsx'

//toast
import { useToastHook } from './components/Toast.jsx';
import { ChatIcon } from '@chakra-ui/icons';



function ExampleComponent() {
	Axios.defaults.baseURL = process.env.BACKENDURL;

	const initialState = {
		loggedIn: Boolean(localStorage.getItem('complexappToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('complexappToken'),
			username: localStorage.getItem('complexappUsername'),
			avatar: localStorage.getItem('complexappAvatar'),
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadChatCount: 0,
	};
	const [toast, newToast] = useToastHook();


	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.user = action.data;
				break;
			case 'logout':
				draft.loggedIn = false;
				break; //both return and break does the same work..
			case 'flashMessages':
				newToast({
					message: action.value,
					status: action.status ? action.status : 'success',
				});
				break;
			case 'openSearch':
				draft.isSearchOpen = true;
				break;
			case 'closeSearch':
				draft.isSearchOpen = false;
				break;
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen;
				break;
			case 'incrementUnreadChatCount':
				draft.unreadChatCount++;
				break;
			case 'clearUnreadChatCount':
				draft.unreadChatCount = 0;
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);
	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('complexappToken', state.user.token);
			localStorage.setItem('complexappUsername', state.user.username);
			localStorage.setItem('complexappAvatar', state.user.avatar);
		} else {
			localStorage.removeItem('complexappToken');
			localStorage.removeItem('complexappUsername');
			localStorage.removeItem('complexappAvatar');
		}
	}, [state.loggedIn]);
	useEffect(() => {
		if (state.loggedIn) {
			// send axios request here
			const ourRequest = Axios.CancelToken.source();
			async function fetchResult(params) {
				try {
					const response = await Axios.post(
						'/checkToken',
						{ token: state.user.token },
						{ CancelToken: ourRequest.token }
					);
					if (!response.data) {
						dispatch({ type: 'logout' });
						dispatch({
							type: 'flashMessages',
							value: 'Your session has expired. Please login again.',
						});
					}
				} catch (e) {
					console.log(e);
					console.log('there was a problem or request was cancelled.');
				}
			}
			fetchResult();
			return () => {
				ourRequest.cancel();
			};
		}
	}, []);
	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					{state.isSearchOpen && (
						<Suspense fallback="">
							<Search />
						</Suspense>
					)}
					<Header />
					<Suspense fallback={<LoadingDotIcon />}>
						<Routes>
							<Route path="/post/:id/edit" exact element={<EditPost />} />
							<Route path="/profile/:username/*" exact element={<Profile />} />
							<Route
								path="/"
								exact
								element={state.loggedIn ? <Home /> : <Homeguest />}
							/>
							<Route path="/post/:id" exact element={<ViewSinglePost />} />
							<Route path="/create-post" exact element={<CreatePost />} />
							<Route path="/about-us" exact element={<About />} />
							<Route path="/terms" exact element={<Terms />} />
							<Route path="" element={<NotFound />} />
						</Routes>
					</Suspense>
					<Suspense fallback="">{state.loggedIn && <Chat />} </Suspense>
					<Footer />
					{state.loggedIn && <FAB/>}
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}
createRoot(document.getElementById('app')).render(
	<ChakraProvider theme={theme}>
		<ExampleComponent />
	</ChakraProvider>
);

if (module.hot) {
	module.hot.accept();
}
