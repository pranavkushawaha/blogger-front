import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";
import {Link} from "react-router-dom";
import { muted } from "../styles.jsx";

function Footer(){
    return (
    <Box>
      <Divider/>
    <Box textAlign={"center"} my={10} px={4}>
      <Text sx={muted}><Link to="/" style={{color:"#006fe6"}}>Home</Link> | <Link  to="/about-us" style={{color:"#006fe6"}}>About Us</Link> | <Link  to="/terms" style={{color:"#006fe6"}}>Terms</Link></Text>
      <Text sx={muted}>Copyright &copy; 2023 <Link to="/" >BloggerApp</Link> | Developed with a lot of effort | All rights reserved.</Text>
    </Box>
    </Box>
    );
}
export default Footer;