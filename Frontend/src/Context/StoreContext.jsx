import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)
// This allows other components to access the context using useContext().
// Any component that needs to consume the context must import StoreContext

const StoreContextProvider = (props) =>{

    const [cartItems,setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token,setToken] = useState("");
    const [food_list,setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if(!cartItems[itemId])
        {
            setCartItems((prev)=>({...prev,[itemId]:1}))
            // console.log(cartItems);
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
            // console.log(cartItems);
        }
        if(token)
        {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }

    const removeFromCart = async (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        // console.log(cartItems);
        if(token)
        {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});

        }
    }

    const getTotalCartAmount = ()=>{
        let totalAmount =0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                let itemInfo = food_list.find((product)=>product._id===item);
                totalAmount += itemInfo.price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data);
    }


    const loadCartData = async (token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
        setCartItems(response.data.cartData)
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token"))
            {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    // useEffect(()=>{
    //     console.log(cartItems)   
    // },[cartItems])
    // Dependency Array ([cartItems]) This tells useEffect when to run. The effect will only run when cartItems changes

    const contextValue={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,setToken

    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
// This is needed to wrap your entire application (or a part of it) so that all components inside can access the context.
// It provides the value (shared state & functions) to all children.



// he Context API is used for managing global state that needs to be shared across multiple components without the need for prop drilling.

// React's Context API provides a way to share state (data) across multiple components without passing props manually at every level. It's useful when multiple components in your app need access to the same 


// Defines a functional component (StoreContextProvider)
// This component will wrap the entire application or a part of it to provide global data access.

// StoStoreContext.Provider is a React component that comes with createContext(). It provides the state (data and functions) to all its child components.