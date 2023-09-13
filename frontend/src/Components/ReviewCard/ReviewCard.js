import React from 'react';
import ReactStars from "react-rating-stars-component/dist/react-stars";
import profilePng from "../../images/Profile.png";
import "./ReviewCard.css";
import {Rating} from "@mui/lab";

const ReviewCard = ({ review }) => {

    // const options={
    //     edit:false,
    //     color: "rgba(20,20,20,0.1)",
    //     activeColor: "tomato",
    //     size: window.innerWidth < 600 ? 20 : 25,
    //     value: review.rating,
    //     isHalf: true
    // }

    const options = {
        size: "large",
        value: review.rating,
        readOnly: true,
        precision: 0.5,
    };

    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User"/>
            <p>{review.name}</p>
            <Rating {...options}/>
            <span className="reviewCardComment">{review.comment}</span>
        </div>
    );
};

export default ReviewCard;