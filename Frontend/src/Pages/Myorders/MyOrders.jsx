import React, { useContext, useEffect, useState } from 'react'
import "./MyOrder.css"
import { StoreContext } from '../../Context/StoreContext';
import axios from "axios"
import { assets } from '../../assets/assets';
const MyOrders = () => 
{

    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);

    const fetchOrders = async()=>{
        const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}})
        setData(response.data.data);
        // console.log(response.data.data);
    }

    // Call the function whenever the MyOrders component will be loaded using useEffect
    useEffect(()=>{
        if(token)
        {
            fetchOrders();
        }
    },[token] ) //whenever the user login/logout this component needs to be executed i.e.,whenever the token gets updated

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if(index === order.items.length-1)
                            {
                                return item.name+" x "+item.quantity;
                            }
                            else{
                                return item.name+" x "+item.quantity+" , "
                            }
                        })}</p>
                        <p>{"\u20B9"}{order.amount}</p>
                        <p>Items:{order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>
      
    </div>
  )
}

export default MyOrders
