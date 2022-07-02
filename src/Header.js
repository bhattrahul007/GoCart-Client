import React from 'react';
import {Link} from "react-router-dom";
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useStateValue } from './StateProvider';
import { signOut } from '@firebase/auth';
import {auth } from "./firebase";

function Header() {

    const [{basket, user}, dispatch] = useStateValue();

    const handleAuthentication = () =>{
        if(user){
            signOut(auth);
        }
    }

    return (
        <div className='header'>
            <Link to="/">
                <span>GoCart</span>
            </Link>
            <div className="header_search">
                <input className="header_searchInput" type="text"/>
                <SearchIcon className="header_searchIcon"/>
            </div>

            <div className="header_nav">
                <Link to={!user && "/login"}>
                    <div onClick={handleAuthentication} className="header_option">
                        <span className="header_optionLineOne">Hello {user? user.email :'Guest'}</span>
                        <span className="header_optionLineTwo">{user?'Sign out': 'Sign in'}</span>
                    </div>
                </Link>
                <Link to="/orders">
                    <div className="header_option">
                        <span className="header_optionLineOne">Returns</span>
                        <span className="header_optionLineTwo">& Orders</span>
                    </div>
                </Link>
                <div className="header_option">
                    <span className="header_optionLineOne">Your</span>
                    <span className="header_optionLineTwo">Prime</span>
                </div>
                <Link to="/checkout">
                    <div className="header_optionBasket">
                        <ShoppingBasketIcon/>
                        <span className="header_optionLineTwo header_basketCount">{basket?.length}</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Header
