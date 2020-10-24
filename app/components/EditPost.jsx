import React, { useEffect,useState,useContext } from "react"
import Page from "./Page.jsx"
import {useImmerReducer} from 'use-immer'
import {useParams, Link, withRouter} from 'react-router-dom'
import Axios from "axios"
import LoadingDotIcon from './LoadingDotIcon.jsx'
import StateContext from '../StateContext.jsx'
import DispatchContext from '../DispatchContext.jsx'
import NotFound from "./NotFound.jsx"

function EditPost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    title:{
      value:"",
      hasError:false,
      message:""
    },
    body:{
      value:"",
      hasError:false,
      message:""
    },
    isFetching:true,
    isSaving:false,
    sendCount:0,
    id:useParams().id,
    notFound:false
  }
  
  function ourReducer(draft,action){
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        break;
      case 'titleChange':
        draft.title.value = action.value
        break;
      case 'bodyChange' :
        draft.body.value = action.value
        break
      case 'submitUpdate':
        if (!draft.title.hasError && !draft.body.hasError){
          draft.sendCount++
          appDispatch({type:'flashMessages' ,value:"Congrats, you successfully updated a post. "})
        }
        break
      case 'saveRequestStarted':
        draft.isSaving = true
        break
      case 'saveRequestFinished':
        draft.isSaving = false
        break 
      case 'titleRules':
        if (!action.value.trim()){
          draft.title.hasError = true
          draft.title.message = 'You must provide a title.'
        }  
        break
      case 'bodyRules':
        if (!action.value.trim()){
          draft.body.hasError = true
          draft.body.message = 'You must provide a body content.'
        }
        break
      case 'notFound':
        draft.notFound = true  
      default:
        break;
    }
  }
  const [state, dispatch] =  useImmerReducer(ourReducer,initialState)
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost(){
      try {
        const response = await Axios.get(`/post/${state.id}`,{cancelToken:ourRequest.token})
        if (response.data) {
          dispatch({type:"fetchComplete", value:response.data})
          if (appState.user.username != response.data.author.username) {
            appDispatch({type: 'flashMessage', value:"You do not have permission to edit that post."})
            props.history.push('/')
          }
        } else {
          dispatch({type:'notFound'})
        }
      } catch (e) {
        console.log('There was a problem.');
        
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel();
    }
  }, [])
  useEffect(() => {   
    if (state.sendCount){
      dispatch({type:'saveRequestStarted'})
      async function fetchPost(){
        try {
          const response = await Axios.post(`/post/${state.id}/edit`,{title:state.title.value,body:state.body.value,token:appState.user.token})
          dispatch({type:"fetchComplete", value:response.data})
          dispatch({type:'saveRequestFinished'})
        } catch (e) {
          console.log('There was a second problem.'+ e);         
        }
      }      
      fetchPost()  
    }
  }, [state.sendCount])

  function handleSubmit(e){
    e.preventDefault()
    dispatch({type:'bodyRules', value:state.body.value})
    dispatch({type:'titleRules', value:state.title.value})
    dispatch({type:'submitUpdate'})
  }
  if (state.notFound){
    return (
      <NotFound />
    )
  }
  if (state.isFetching) return <div><LoadingDotIcon /></div>
  return (
    
    <Page title='Edit Post'>
      <Link className="small font-weight-light" to={`/post/${state.id}`} >&laquo; Back to post permalink</Link>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({type:'titleRules', value:e.target.value})} onChange={(e) => dispatch({type:'titleChange',value:e.target.value})} defaultValue={state.title.value} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          { state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({type:'bodyRules', value:e.target.value})} onChange={(e) => dispatch({type:'bodyChange',value:e.target.value})} defaultValue={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
          { state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving} >Save Update</button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "fjlsakjljflajklsdjaljfalkjaljflajklf"
// createdDate: "2020-06-12T06:57:02.618Z"
// isVisitorOwner: false
// title: "jfslfjla"
// _id: "5ee3273eb05a2d29acf076b9"