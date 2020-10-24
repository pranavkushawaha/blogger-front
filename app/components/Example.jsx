import React, { useEffect,useState,useContext } from "react"
import {useImmerReducer} from 'use-immer'
import Page from "./Page.jsx"
import {useParams, Link} from 'react-router-dom'
import Axios from "axios"
import LoadingDotIcon from './LoadingDotIcon.jsx'
import StateContext from "../StateContext.jsx"
import DispatchContext from '../DispatchContext.jsx'


function EditPost() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const [sendCounts , setSendCounts] = useState(0)
    const [isFetching , setisFetching] = useState(false)
    
    const initialState = {
      isFetching: true,
      isSaving:false,
      id:useParams().id,
      
      body:{
          value:"",
          hasError:false,
          message:""
      },
      title:{
          value:"",
          hasError:false,
          message:"" 
      }
    }

    function OurReducer(draft,action){
        switch (action.type) {
            case 'fetchComplete':
                draft.title.value = action.value.title
                draft.body.value = action.value.body
                setisFetching (false)
                break;
            case 'titleChange':
                draft.title.value = action.value
                if(action.value.trim()){
                  draft.title.hasError = false
                }
                break;    
            case 'bodyChange':
                draft.body.value = action.value
                if(action.value.trim()){
                  draft.body.hasError = false
                }
                break;
            case "SubmitRequest":
                if (!draft.title.hasError && !draft.bady.hasError){
                  setSendCounts( prev => prev + 1)
                }else{
                  console.log("cannt submit the request")
                }
                break;
            case 'saveRequestStarted' :
                draft.isSaving = true
                break;
            case 'saveRequestfinished':
                draft.isSaving = false
                break;
            case 'titleRules':
                if(!action.value.trim()){
                  draft.title.hasError = true
                  draft.title.message = "You must provide a title."
                }else return null
                break;
            case 'bodyRules':
                if(!action.value.trim()){
                  draft.body.hasError = true
                  draft.body.message = "You must provide a body content."
                }else return null
                break;
            default :
                return {...draft}
              
        }
    }


    const [state , dispatch] = useImmerReducer(OurReducer , initialState);
  
  
  
  
    useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost(){
      try {
        const response = await Axios.get(`/post/${state.id}`,{cancelToken:ourRequest.token})
        dispatch({type:"fetchComplete",value:response.data})
        
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
    if (sendCounts) {
      dispatch({type:"saveRequestStarted"})
      async function fetchPost(){
      try {
        const response = await Axios.post(`/post/${state.id}/edit`,{title:state.title.value,body:state.body.value,token:appState.user.token})
        console.log(response.data);
        console.log(state.title.value,state.body.value);
        
        dispatch({type:'saveRequestfinished'})
        appDispatch({type:"flashMessages", value:"Congrats, new post created."})       
      } catch (e) {
        console.log('There was a problem.');        
      }
    }
    fetchPost()
    }
  }, [sendCounts])
  

  function SubmitHandler(e){
      e.preventDefault();
      dispatch({type: 'titleRules', value: e.target.value})
      dispatch({type: 'bodyRules', value: e.target.value})
      dispatch({type:'SubmitRequest'})
  }

  if (isFetching) {return <div><LoadingDotIcon /></div>}else
  return (
    <Page title='Edit Post'>
      <form onSubmit={SubmitHandler} >
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input 
            onBlur={e => dispatch({type: 'titleRules', value: e.target.value})} 
            onChange={(e) => dispatch({type:"titleChange", value:e.target.value})}  
            value={state.title.value} 
            autoFocus 
            name="title" 
            id="post-title" 
            className="form-control form-control-lg form-control-title" 
            type="text"  
            autoComplete="off" 
          />
          { state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea 
            onBlur={e => dispatch({type: 'bodyRules', value: e.target.value})} 
            onChange={(e) => dispatch({type:"bodyChange", value:e.target.value})}  
            value={state.body.value} 
            name="body" 
            id="post-body" 
            className="body-content tall-textarea form-control" 
            type="text" 
          />
          { state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>
        <button className="btn btn-primary" disabled={false} >Save Update</button>
      </form>
    </Page>
  )
}

export default EditPost;

// author: {username: "pransd", avatar: "https://gravatar.com/avatar/9dde7873420b45bd2854e36a5e8453fb?s=128"}
// body: "fjlsakjljflajklsdjaljfalkjaljflajklf"
// createdDate: "2020-06-12T06:57:02.618Z"
// isVisitorOwner: false
// title: "jfslfjla"
// _id: "5ee3273eb05a2d29acf076b9"