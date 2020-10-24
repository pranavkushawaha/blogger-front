import React, { useEffect,useState,useContext } from "react"
import Axios from "axios"
import {useParams,Link} from 'react-router-dom'
import StateContext from '../StateContext.jsx'
import LoadingDotIcon from './LoadingDotIcon.jsx'


function ProfileFollowers() {
    const [isLoading, setIsloading] = useState(true)
    const [posts,setPosts] = useState([])
    const {username} = useParams()
    const appState = useContext(StateContext)
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchPosts(){
            try {
                const response = await Axios.get(`/profile/${username}/followers`, {token: appState.user.token,cancelToken:ourRequest.token})
                setPosts(response.data)                
                setIsloading(false)
            } catch (e) {
                console.log(e);       
            }
        }
        fetchPosts()
        return () => {
            ourRequest.cancel();
          }
    },[username])
    if (isLoading){
        return <div><LoadingDotIcon /></div>
    }else{
    return (
        <div className="list-group">
            {posts.map((item,index) => {
                return (
                    <Link key={index} to={`/profile/${item.username}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={item.avatar} /> {item.username}
                    </Link>
                )
            })}
        </div>
    )}
}

export default ProfileFollowers