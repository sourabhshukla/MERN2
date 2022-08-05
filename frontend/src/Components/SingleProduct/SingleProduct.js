import React, {Fragment, useEffect, useState} from 'react';
import "./SingleProduct.css";
import ReactStars from "react-rating-stars-component/dist/react-stars";
import {reviews} from "../../data";
import man from "../../images/Man.png";
import ReviewCard from "../ReviewCard/ReviewCard";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import {useParams} from "react-router-dom";
import {addItemsToCart} from "../../actions/cartAction";
import {clearErrors,getProductDetails,newReview} from "../../actions/productAction";
import {NEW_REVIEW_RESET} from "../../constants/productConstants";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {Rating} from "@mui/material";
import Loader from "../Loader/Loader";

const SingleProduct = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();

    const {product,loading,error} = useSelector(
        (state) => state.productDetails
    )


    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    )

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [productImage, setProductImage] = useState({man});

    const increaseQuantity = () => {
      if(product.stock <= quantity) return;

      const qty = quantity + 1;
      setQuantity(qty);
    }

    const decreaseQuantity = () => {
      if (1 >= quantity) return;

      const qty = quantity-1;
      setQuantity(qty);
    }


    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart");
    }

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating.toString());
        myForm.set("comment", comment);
        myForm.set("productId", id);

        dispatch(newReview(myForm));

        setOpen(false);
    };

    useEffect(() => {
        if (error) {
            console.log(error);
            alert.error(error);
           // alert(error.toString());

           // dispatch(clearErrors());
        }

        if (reviewError) {
            alert.error(reviewError);
            console.log(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, reviewError, success]);

    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    // const options={
    //     edit:false,
    //     color: "rgba(20,20,20,0.1)",
    //     activeColor: "tomato",
    //     size: window.innerWidth < 600 ? 20 : 25,
    //     value: product.ratings,
    //     isHalf: true
    // }
    // const product1={
    //     Stock: 2
    // }
   // console.log(loading+" hello");
    return (
       <Fragment>
           {loading ? <Loader/> : (
               <Fragment>
                   <div className="ProductDetails">
                       <div>
                           {/*<img src="https://images.unsplash.com/photo-1640526749826-dfd352d4f49b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt=""/>*/}

                           {product.images && <img src={product.images[0].url} alt=""/>}

                           {/*{product.images && product.images.map((item,i)=>(*/}
                           {/*    <img src={item.url} alt=""/>*/}
                           {/*))}*/}

                       </div>

                       <div>
                           <div className="detailsBlock-1">
                               <h2>{product.name}</h2>
                               <p>Product # {product._id}</p>
                           </div>
                           <div className="detailsBlock-2">
                               <Rating {...options}/>
                               <span className="detailsBlock-2-span">({product.numOfReviews} Reviews)</span>
                           </div>
                           <div className="detailsBlock-3">
                               <h1>₹ {product.price}</h1>
                               <div className="detailsBlock-3-1">
                                   <div className="detailsBlock-3-1-1">
                                       <button onClick={decreaseQuantity}>-</button>
                                       <input readOnly type="number" value={quantity}/>
                                       <button onClick={increaseQuantity}>+</button>
                                   </div>
                                   <button
                                       disabled={product.stock < 1 ? true : false}
                                       onClick={addToCartHandler}
                                   >Add to Cart</button>
                               </div>

                               <p>
                                   Status:{" "}
                                   <b className={product.stock<1?"redColor":"greenColor"}>
                                       {product.stock<1?"OutOfStock":"InStock"}
                                   </b>
                               </p>
                           </div>

                           <div className="detailsBlock-4">
                               Description: <p>{product.description}</p>
                           </div>

                           <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                       </div>
                   </div>

                   <h3 className="reviewHeading">REVIEWS</h3>

                   <Dialog
                       aria-labelledby="simple-dialog-title"
                       open={open}
                       onClose={submitReviewToggle}
                   >
                       <DialogTitle>Submit Review</DialogTitle>
                       <DialogContent className="submitDialog">
                           <Rating
                               onChange={(e) => setRating(e.target.value)}
                               value={rating}
                               size="large"
                           />
                           <textarea
                               className="submitDialogTextArea"
                               cols="30"
                               rows="5"
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                           />
                       </DialogContent>
                       <DialogActions>
                           <Button onClick={submitReviewToggle} color="secondary">Cancel</Button>
                           <Button onClick={reviewSubmitHandler} color="primary">Submit</Button>
                       </DialogActions>
                   </Dialog>

                   {product.reviews && product.reviews[0] ? (
                       <div className="reviews">
                           {product.reviews && product.reviews.map((review)=> <ReviewCard key={review._id} review={review}/>)}
                       </div>
                   ) : (
                       <p className="noReviews">No Reviews</p>
                   )}

               </Fragment>
           )}
       </Fragment>
    );
};

export default SingleProduct;