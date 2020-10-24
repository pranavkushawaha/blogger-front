import React, { useEffect, useContext } from "react"
import Page from "./Page.jsx"
import {useParams, NavLink, Switch, Route} from "react-router-dom"
import Axios from "axios"
import StateContext from "../StateContext.jsx"
import ProfilePosts from './ProfilePosts.jsx'
import { useImmer } from "use-immer"
import ProfileFollowing from "./ProfileFollowing.jsx"
import ProfileFollowers from "./ProfileFollowers.jsx"

function Profile() {
    const {username} = useParams()
    const appState = useContext(StateContext)
    const [state,setState] = useImmer({
      followActionLoading : false,
      startFollowingRequestCount : 0 , 
      stopFollowingRequestCount: 0,
      profileData: {        
        isFollowing: false,
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        profileUsername: "...",
        counts: {postCount: '', followerCount: '', followingCount: ''}
      }
    })

    useEffect(() => {
        async function fetchData(){
            try {
                const response = await Axios.post(`/profile/${username}`, {token:appState.user.token})
                setState(draft => {
                  draft.profileData = response.data
                })
            } catch (error) {
                console.log("there was a problem..");
                
            } 
        }
        fetchData(); 
    }, [username])
 
    useEffect(() => {
      if (state.startFollowingRequestCount) {
        setState(draft => {
          draft.followActionLoading = true
        })
        async function fetchData(){
          try {
              const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, {token:appState.user.token})
              setState(draft => {
                draft.profileData.isFollowing = true,
                draft.profileData.counts.followerCount++
                draft.followActionLoading = false
              })
          } catch (error) {
              console.log("there was a problem..");
              
          } 
      }
      fetchData(); 
      }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      async function fetchData(){
        try {
            const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, {token:appState.user.token})
            setState(draft => {
              draft.profileData.isFollowing = false,
              draft.profileData.counts.followerCount--
              draft.followActionLoading = false
            })
        } catch (error) {
            console.log("there was a problem..");
            
        } 
    }
    fetchData(); 
    }
}, [state.stopFollowingRequestCount])


  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }


  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>}

        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Stop Following <i className="fas fa-user-times"></i></button>}

      </h2>
{/* // postCount, followerCount, followingCount */}
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink exact to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path='/profile/:username'>
          <ProfilePosts />
        </Route>
        <Route exact path='/profile/:username/followers'>
          <ProfileFollowers />
        </Route>
        <Route path='/profile/:username/following'>
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  )
}

export default Profile