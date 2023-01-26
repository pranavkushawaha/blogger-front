import React, { useEffect } from 'react';
import Container from './Container.jsx';

import { Box, Card } from '@chakra-ui/react';

function Page(props) {
	useEffect(() => {
		document.title = `${props.title} | BloggerApp`;
		window.scrollTo(0, 0);
	}, []);
	return (
		<Box
			paddingY="50px"
			paddingX={{ base: '5%', xl: props.width ? props.width : '10%' }}
			// backgroundColor="red"
      sx={props.style}
		>
			{/* <Card> */}

			{props.children}
			{/* </Card> */}
		</Box>
	);
}

export default Page;
