import React, { useEffect,useState,useContext } from "react"
import Page from "./Page.jsx"
import {useParams, Link,withRouter} from 'react-router-dom'
import Axios from "axios"
import LoadingDotIcon from './LoadingDotIcon.jsx'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'
import NotFound from "./NotFound.jsx"
import StateContext from '../StateContext.jsx'
import DispatchContext from '../DispatchContext.jsx'

function ViewSinglePost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const {id} = useParams()
  const [isLoading , setIsloading] = useState(true)
  const [post , setPost] = useState({})
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost(){
      try {
        const response = await Axios.get(`/post/${id}`,{cancelToken:ourRequest.token})
        setPost(response.data)
        setIsloading(false)
        
      } catch (e) {
        console.log('There was a problem.');
        
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel();
    }
  }, [id])
  const date = new Date(post.createdDate);
  const dateFormatted = date.getDate()+"/"+(date.getMonth()+1)+'/'+date.getFullYear();
  function isOwner(){
    if (appState.user.username == post.author.username){
      return true
    }else {
      return false
    }
  }
  async function deleteHandler(){
    const areYouSure = window.confirm("Do you really want to delete this post.")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`,{data:{token:appState.user.token}})         
        if(response.data == 'Success'){
          appDispatch({type:'flashMessages' ,value: "Post was successfully deleted."})
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  if (!isLoading && !post){
    return (
      <NotFound />
    )
  }
  if (isLoading) return <div><LoadingDotIcon /></div>
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip='Edit' data-for='edit' className="text-primary mr-2"><i className="fas fa-edit"></i></Link>
              <ReactTooltip id='edit' className='custom-tooltip'/>{'  '}
            <a onClick={deleteHandler} data-tip='Delete' data-for='delete' className="delete-post-button text-danger" ><i className="fas fa-trash"></i></a>
              <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
        
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.isVisitorOwner?'you':post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "fjlsakjljflajklsdjaljfalkjaljflajklf"
// createdDate: "2020-06-12T06:57:02.618Z"
// isVisitorOwner: false
// title: "jfslfjla"
// _id: "5ee3273eb05a2d29acf076b9"