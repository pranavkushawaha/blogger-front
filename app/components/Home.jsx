import React, { useEffect, useContext } from "react"
import Page from "./Page.jsx"
import StateContext from '../StateContext.jsx'
import { useImmer } from "use-immer"
import LoadingDotIcon from "./LoadingDotIcon.jsx"
import Axios from 'axios'
import {Link} from 'react-router-dom'

function Home() {
  const appState = useContext(StateContext)
  const [state,setState] = useImmer({
    isLoading:true,
    feed : [],

  })

  useEffect(() => {
    async function fetchData(){
        try {
            const response = await Axios.post('/getHomeFeed', {token:appState.user.token})
            setState(draft => {
              draft.feed = response.data
              draft.isLoading = false
            })
        } catch (error) {
            console.log("there was a problem..");
            
        } 
    }
    fetchData(); 
}, [])

  if (state.isLoading) {
    return <LoadingDotIcon />
  }

  return (
    <Page title="Your Feed">
     {state.feed.length == 0 ? (<><h2 className="text-center">Hello <strong>{appState.user.username}</strong>, your feed is empty.</h2>
      <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p></>) : (
        <>
         <h2 className='text-center mb-4'>The Latest From Those You Follow</h2>
         <div className='list-group'>
         {state.feed.map(item => {
                const date = new Date(item.createdDate);
                const dateFormatted = date.getDate()+"/"+(date.getMonth()+1)+'/'+date.getFullYear();
                return (
                    <Link key={item._id} to={`/post/${item._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={item.author.avatar} /> <strong>{item.title}</strong> {' '}
                <span className="text-muted small">by {item.author.username} on {dateFormatted} </span>
                    </Link>
                )
            })}
         </div>
        </>
      )}
    </Page>
  )
}

export default Home