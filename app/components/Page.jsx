import React, { useEffect } from "react"
import Container from "./Container.jsx"

import { Box, Card } from "@chakra-ui/react";

function Page(props) {
     useEffect(() => {
    document.title = `${props.title} | BloggerApp`
    window.scrollTo(0,0)
  }, [])
  return (
    <Box
      marginY="20"
      paddingX={{ base: "5%", xl: props.width ? props.width : "10%" }}
      // backgroundColor="gray.100"
    >
      {/* <Card> */}

      {props.children}
      {/* </Card> */}
    </Box>
  )
}

export default Page