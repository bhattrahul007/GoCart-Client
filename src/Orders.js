import React, {useState, useEffect} from 'react';
import "./Orders.css";
import {db} from "./firebase";
import { useStateValue } from './StateProvider';
import {collection, doc, getDocs, orderBy, query} from "firebase/firestore";
import Order from "./Order";

function Orders() {
    const [{basket, user}, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        if(user){
            const q = query(collection(db, `users/${user.uid}/orders`), orderBy('created', 'desc'));
            const querySnapshot = getDocs(q);
            querySnapshot.then((snapshot)=>{
                setOrders(snapshot.docs.map(doc=>({
                    id: doc.id,
                    data: doc.data()
                })))
            })
        }else{
            setOrders([]);
            console.log("user is not defined");
        }
    }, [user])
    return (
        <div className="orders">
            <h1>Your orders</h1>
            <div  className="orders_order">
                {orders?.map(order => (
                    <Order order={order}/>
                ))}
            </div>
        </div>
    )
}

export default Orders;
