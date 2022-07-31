import React, {Fragment, useEffect, useRef, useState} from 'react';
import "./Allproducts.css";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import {all_products} from "../../data";
import {categories} from "../../data";
import Pagination from "react-js-pagination"
import ReactStars from "react-rating-stars-component/dist/react-stars";
import {useDispatch, useSelector} from "react-redux";
import {getProduct} from "../../actions/productAction";
import {useParams, Link, useLocation} from "react-router-dom";
import {Rating} from "@mui/lab";

const AllProducts = () => {

    const dispatch = useDispatch();
    const location=useLocation();
    let category1=null;
    if(location.state!=null){
        let {category2} = location.state;
        console.log("category2="+category1);
        category1=category2;
    }
    const {products,loading,productsCount,resultPerPage,filteredProductsCount} = useSelector(state=>state.products);
    const [price, setPrice] = useState([0,25000]);
    const [category, setCategory] = useState(category1);
    console.log("category="+category);

    const [rating, setRating] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const min = useRef(price[0]);
    const max = useRef(price[1]);
    const category_input = useRef(category==null ? "All" : `${category}`);
   // category_input.current.value.checked=true;


    let {keyword} = useParams();


    let count = filteredProductsCount;

    useEffect(()=>{
        if(category1==null){
         //   console.log(category1);
        }
        dispatch(getProduct(keyword,price,category,currentPage,rating));
    },[dispatch,keyword,price,category,category1,currentPage,rating]);

    const onRatingsChanged=(new_rating)=>{
        alert(new_rating);
        console.log(new_rating);
    }

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    }

    const options = {
        size: "large",
        //value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    // const options={
    //     edit: false,
    //     color: "rgba(20,20,20,0.1)",
    //     activeColor: "tomato",
    //     size: window.innerWidth < 600 ? 20 : 25, // for mobiles size = 20px and for desktop size=25px
    //     // value: Number(`${all_products.rating}`),
    //     isHalf: "true"
    // }

    const options2={
        edit:true,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        isHalf: true,
        value: Number(`${rating}`),
        // onChange: onRatingsChanged
        onChange: setRating
    }

    const options3={
        edit: true,
        precision: 0.5,
    }

    const priceHandler = (e) => {
        e.preventDefault();
        setPrice([min.current.value, max.current.value]);
    }

    const categoryChangeHandler=(e)=> {
        //alert(category_input.current.categories.value);
        //alert(e.target.value);
        setCategory(e.target.value);
    }

    return (
        <Fragment>
            <Header/>
        <div className="all_products_container">
            <div className="filters_container">
                <form className="filters_container_form">
                    <fieldset className="filters_container_categories">
                        <legend>Categories</legend>
                        <div className="filters_category_item" key="all">
                            <input type="radio" id="All" value="" ref={category_input} checked={category === null || category===""}
                                   name="categories" onChange={categoryChangeHandler}/>
                            <label htmlFor="All">All</label>
                        </div>
                        {categories.map((cat,index)=>(
                            <div className="filters_category_item" key={index}>
                                <input type="radio" id={cat.title} value={cat.title} checked={category===cat.title}
                                       ref={category_input} name="categories" onChange={categoryChangeHandler}/>
                                <label for={cat.title}>{cat.title}</label>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset className="filters_container_price">
                        <legend>Price</legend>
                        <input type="text" id="min" placeholder="Min" ref={min}/>
                        <input type="text" id="max" placeholder="Max" ref={max}/>
                        <button onClick={priceHandler}>Go</button>
                    </fieldset>

                    <fieldset className="filters_container_ratings">
                        <legend>Ratings Above</legend>
                        {/*<ReactStars {...options2} />*/}
                        <Rating {...options3} onChange={(event, newValue)=>{
                            setRating(newValue);
                        }}/>
                    </fieldset>
                </form>
            </div>
            <div className="products_container">
                {/*{all_products.map((product, index)=>(*/}
                {/*    <div className="products_wrapper" key={index}>*/}
                {/*        <img src={product.src} alt=""/>*/}
                {/*        <p>{product.name}</p>*/}
                {/*        <ReactStars {...options}/>*/}
                {/*        <p>({product.numOfReviews} Reviews)</p>*/}
                {/*        <p>₹ {product.price}</p>*/}
                {/*    </div>*/}
                {/*))}*/}

                {products && products.map((product, index)=>(
                    <Link to = {`/product/${product._id}`}>
                        <div className="products_wrapper" key={index}>
                            <img src={product.images[0].url} alt=""/>
                            <p>{product.name}</p>
                            <Rating {...options}
                                        value = {product.ratings}/>
                            <p>({product.numOfReviews} Reviews)</p>
                            <p>₹ {product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
            {resultPerPage < count && (
                <div className="paginationBox">
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={productsCount}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Prev"
                        firstPageText="1st"
                        lastPageText="Last"
                        itemClass="page-item"
                        linkClass="page-link"
                        activeClass="pageItemActive"
                        activeLinkClass="pageLinkActive"
                    />
                </div>
            )}
            <Footer/>
        </Fragment>
    );
};

export default AllProducts;