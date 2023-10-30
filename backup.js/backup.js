//store.js

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";//for making store as async
import productsReducer from "./slices/ProductsSlice";

const reducer = combineReducers({
    productsState : productsReducer
})

const store = configureStore({
    reducer,
    middleware:[thunk]
})

export default store;

//slices/ProductsSlice.js
import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name : 'products',
    initialState : {
        loading : false
    },
    reducers : {
        productsRequest(state ,action){
            return{
                loading:true
            }
        },
        productsSucsess(state,action){
            return {
                loading : false,
                products : action.payload.products
            }
        },
        productsFail(state,action){
            return{
                loading : false ,
                error : action.payload
            }
        }
    }
});

const {actions , reducer} = productsSlice;

export const {productsRequest,productsSucsess,productsFail} = actions

export default reducer;

//Actions/productsaction.js
import axios from 'axios'
import { productsFail, productsRequest, productsSucsess } from '../slices/ProductsSlice'
export const getProducts = async (dispatch) => {
    try {
        dispatch(productsRequest())
        const { data } = await axios.get('/api/v1/products')
        dispatch(productsSucsess(data))

    } catch (error) {
        //to handle errors if not data give back
        dispatch(productsFail(error.response.data.message))
    }
}

//home.js
import { useEffect } from "react";
import Metdata from "./layouts/Metadata";
import { getProducts } from "../Actions/productsaction";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
    const dispatch = useDispatch();

    const {products,loading} = useSelector((state)=>state.productsState)

    useEffect(()=>{
        dispatch(getProducts)
    },[])
    return (
        <>
        <Metdata title={'Art page'}/>
            <h1 id="products_heading">Latest Products</h1>

            <section id="products" className="container mt-5">
                <div className="row">
                    {products && products.map(product =>{
                       
                   
                    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                        <div className="card p-3 rounded">
                            <img
                                className="card-img-top mx-auto"
                                src="./images/products/01.jpg"
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">
                                    <a href="">{product.name}</a>
                                </h5>
                                <div className="ratings mt-auto">
                                    <div className="rating-outer">
                                        <div className="rating-inner"></div>
                                    </div>
                                    <span id="no_of_reviews">({product.price} Reviews)</span>
                                </div>
                                <p className="card-text">$245.67</p>
                                <a href="#" id="view_btn" className="btn btn-block">View Details</a>
                            </div>
                        </div>
                    </div>
                     })}
                </div>
            </section>
        </>
    )
}
//app.js
import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;


//index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './Store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
    
 //  </React.StrictMode>
);
 

