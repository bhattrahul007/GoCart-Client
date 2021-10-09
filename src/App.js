import './App.css';
import { useEffect } from 'react';
import Header from './Header';
import Home from "./Home";
import Checkout from "./Checkout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Login';
import { onAuthStateChanged } from '@firebase/auth';
import {auth} from "./firebase";
import Payment from "./Payment"
import { useStateValue } from "./StateProvider";
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import Orders from "./Orders";
function App() {

  const stripePromise = loadStripe('Enter your publish key here')
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    // only run once the component loads
    onAuthStateChanged(auth, authUser=>{
      console.log("The user is >> ", authUser);
      if(authUser){
        // the user just logged in/ the user was logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        });
      }else{
        // the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null,
        });
      }

    })
  }, [])
  return (
    // BEM
    <Router>
      <div className="App">
          <Switch>
            <Route path="/orders">
              <Header/>
              <Orders/>
            </Route>
            <Route path="/payment">
              <Header/>
              <Elements stripe={stripePromise}>
                <Payment/>
              </Elements>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/checkout">
              <Header/>
              <Checkout/>
            </Route>
            <Route path="/">
              <Header/>
              <Home/>
            </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;
