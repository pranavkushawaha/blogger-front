import { extendTheme, withDefaultColorScheme, defineStyle, defineStyleConfig } from '@chakra-ui/react';


const outline = defineStyle({
	backgroundColor:"primary.50",
	border:"0xp",
	color:"primary.500",
});

const IconButtonTheme = defineStyleConfig({
	variants:{outline}
});


const theme = extendTheme(
	{
		fontColor: {
			p:"red"
			// body: 'Nunito, sans-serif',
			// heading: 'Nunito, sans-serif',
		},
		// radii:{
		//     md:"1rem"
		// },
		styles: {
			global: {
				body: {
					bg: 'blackAlpha.50',
					
				},
				p:{
					color:"blackAlpha.800"
				},
				h1:{
					color:"blackAlpha.800"
				},
				h2:{
					color:"blackAlpha.800"
				},
				h3:{
					color:"blackAlpha.800"
				},
				h4:{
					color:"blackAlpha.800"
				},
			},
		},
		components: {
			Card: {
				baseStyle: {
					container: {
						borderRadius: 'xl',
						_hover: {
							bg: 'whiteAlpha.700',
						},
					},
					header: {
						padding: '10px',
						bg: 'gray.50',
						borderRadius: 'xl',
						m: '20px',
						mb: '0px',
					},
					footer: {
						paddingTop: '2px',
					},
				},
			},
			Tabs: {
				baseStyle: {
					tab: {
						// fontSize:"100px",
						textAlign:"center",
						// fontWeight:"100",
						lineHeight:"1",
						_selected: {
							// fontSize:'100px',
							background: 'red',
							color: 'red',
							backgroundColor: "primary.50",
							// color: 'yellow',
							// fontColor:"yellow"
						},
					},
				},
				// colorScheme:"primary"
			},
			Avatar:{
				baseStyle:{
					container:{
						// border:"10px",
						borderColor:"primary.500",
						borderStyle:"solid"
					}
				}
			},
			Button:IconButtonTheme
		},
		colors: {
			primary: {
				main: '#4aa3ff',
				50: '#edf9ff',
				100: '#aed7ff',
				200: '#7dbdff',
				300: '#4aa3ff',
				400: '#1a88ff',
				500: '#006fe6',
				600: '#0056b4',
				700: '#003d82',
				800: '#002551',
				900: '#000d21',
			},
		},
	},
	withDefaultColorScheme({ colorScheme: 'primary' })
);


export default theme;
