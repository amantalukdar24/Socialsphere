import React,{useEffect} from 'react'
import { useLocation,useNavigate,useParams } from 'react-router-dom'
import {useSelector,useDispatch} from "react-redux"
import { login,logout } from './features/authSlice';

function RefreshHandler() {
    const isLoggedIn=useSelector((state)=>state.auth.value);
    const Dispatch=useDispatch();
    const Location=useLocation();
    const Navigate=useNavigate();
    
   useEffect(()=>{
      if(localStorage.getItem("token"))
    {
        Dispatch(login());
        if(Location.pathname==="/login" || Location.pathname==="/signup" || Location.pathname==="/resetpassword")
        {
            Navigate('/');
            
        }
       
    }
    else{
        if(Location.pathname==='/' || Location.pathname==="/profile" || Location.pathname==="/chats" || Location.pathname==="/search" || Location.pathname==="/settings" || Location.pathname==="/:id" || Location.pathname==="/story/:id" || Location.pathname==="/post/:id" || Location.pathname==="/notification"){
                    Navigate('/login');
        }

        Dispatch(logout());
    }
    
   },[isLoggedIn,Navigate,Location.pathname]);
}

export default RefreshHandler