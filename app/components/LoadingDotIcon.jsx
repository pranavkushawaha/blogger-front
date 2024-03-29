import { Center, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';

function LoadingDotIcon() {
	return (
		<Center h={'50vh'}>
			<Spinner color='primary.600' size="xl" />
		</Center>
	);
}

export default LoadingDotIcon;
