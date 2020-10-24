import React, { useEffect , useContext} from "react"
import {Link} from "react-router-dom";
import DispatchContext from '../DispatchContext.jsx'
import StateContext from '../StateContext.jsx'
import ReactTooltip from "react-tooltip";


function HeaderLoggedIn(props) {
  
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
    function handleClick(){
      appDispatch({type:"logout"})
      appDispatch({type:'flashMessages',value:'You have successfully logged out.'})
    }
    function handleSearchIcon(e){
      e.preventDefault()
      appState.isSearchOpen ? appDispatch({type:"closeSearch"}) : appDispatch({type:'openSearch'})
    }
  return (
        <div className="flex-row my-3 my-md-0">
            <a data-for='search' data-tip='Search' onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
            <i className="fas fa-search"></i>
            </a>
            <ReactTooltip place="bottom" id='search' className='custom-tooltip' />{'   '}


            <span data-for='chat' data-tip={Boolean(appState.unreadChatCount) ? appState.unreadChatCount+"  unread messages" : 'Chat'} onClick={() => appDispatch({type:'toggleChat'})} className={"mr-2 header-chat-icon "+(Boolean(appState.unreadChatCount) ? 'text-danger' : "text-white")}>
            <i className="fas fa-comment"></i>
            {Boolean(appState.unreadChatCount) && <span className="chat-count-badge text-white">{appState.unreadChatCount > 10 ? "9+" : appState.unreadChatCount} </span>}
            </span>
            <ReactTooltip place="bottom" id='chat' className='custom-tooltip'  />{'   '}


            <Link data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} className="mr-2">
            <img className="small-header-avatar" src={appState.user.avatar} />
            </Link>
            <ReactTooltip place="bottom" id='profile' className='custom-tooltip' />{'   '}
            <Link className="btn btn-sm btn-success mr-2" to="/create-post">
            Create Post
            </Link>{'   '}
            <button onClick={handleClick} className="btn btn-sm btn-secondary">
            Sign Out
            </button>
        </div>
  )
}

export default HeaderLoggedIn