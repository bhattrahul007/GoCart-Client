import React, {useEffect, useState} from 'react'
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import {Link, useHistory} from 'react-router-dom';
import { useStateValue } from './StateProvider';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import {getBasketTotal} from "./reducer";
import axios from './axios';
import {db} from "./firebase";
import {setDoc, collection, doc} from "firebase/firestore";

function Payment() {
    const stripe = useStripe();
    const elements = useElements();

    const history = useHistory();

    const [{basket, user}, dispatch] = useStateValue();
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const getClientSecret = async () => {
            let amount = (getBasketTotal(basket) * 100);
            console.log(amount);
            const response = await axios({
                method: 'POST',
                url:`/payments/create?total=${amount}`
            })
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket])

    // if(!stripe || !elements) return;

    const handleSubmit = async event => {
        // do all the stripe stuff
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) => {
            setDoc(doc(db, 'users', user?.uid, 'orders', paymentIntent.id), {
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created,
            })
            // paymentIntent = payment confirmation

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET',
            })

            history.replace('/orders')
        }).catch((error)=>{
            setSucceeded(false)
            setError(error.message);
            setProcessing(false);
        });

    }

    const handleChange = event =>{
        setDisabled(event.empty);
        setError(event.error?event.error.message:"");
    }

    return (
        <div className="payment">
            <div className="payment_container">
                <h1>
                    Checkout (<Link to="/checkout">{basket?.length} items</Link>)
                </h1>
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Delivery Address</h3> 
                    </div>
                    <div className="payment_address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>

                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment_items">
                        {
                            basket?.map((item)=>(
                                <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image = {item.image}
                                price = {item.price}
                                rating = {item.rating}
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Payement Method</h3>
                    </div>
                    <div className="payment_details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment_info">
                                <div className="payment_priceContainer">
                                    <CurrencyFormat
                                    renderText= {(value)=> (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                    />
                                </div>
                                <button type="submit" disabled={disabled}>
                                    <span>{processing ? "Processing" : "Pay"}</span>
                                </button>
                            </div>
                            { error && <div>{error}</div> }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
