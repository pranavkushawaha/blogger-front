import React, { useEffect,useState,useContext } from "react"
import Axios from "axios"
import {useParams,Link} from 'react-router-dom'
import StateContext from '../StateContext.jsx'
import LoadingDotIcon from './LoadingDotIcon.jsx'


function ProfilePosts() {
    const [isLoading, setIsloading] = useState(true)
    const [posts,setPosts] = useState([])
    const {username} = useParams()
    const appState = useContext(StateContext)
    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
        async function fetchPosts(){
            try {
                const response = await Axios.get(`/profile/${username}/posts`, {token: appState.user.token,cancelToken:ourRequest.token})
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
            {posts.map(item => {
                const date = new Date(item.createdDate);
                const dateFormatted = date.getDate()+"/"+(date.getMonth()+1)+'/'+date.getFullYear();
                return (
                    <Link key={item._id} to={`/post/${item._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={item.author.avatar} /> <strong>{item.title}</strong> {' '}
                        <span className="text-muted small">on {dateFormatted} </span>
                    </Link>
                )
            })}
        </div>
    )}
}

export default ProfilePosts



// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "super test."
// createdDate: "2020-06-13T05:14:03.113Z"
// isVisitorOwner: false
// title: "jfljksfslajfsflsjlafjalfsjalkjljf"
// _id: "5ee4609b5502b7128c9e4196"