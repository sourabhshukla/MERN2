import React, {useState, useRef, useEffect} from 'react';
import {products} from "../../data";
import "./Slider.css";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Slider = () => {
    const [slide, setSlide]=useState(0);
    const slide_container = useRef(null);

    const left_slide = () => {
        if(slide>0){
            setSlide(slide-1);
        }
        else{
            setSlide(2);
        }
    }

    const right_slide = () =>{
        console.log("clicked");
        if (slide<2){
            setSlide(slide+1);
        }
        else if(slide===2){
            setSlide(0);
        }
    }

    return (
        <div className="slider_wrapper">
            <div className="arrow-left" onClick={left_slide}>
                    <ArrowLeftIcon id="left-icon" onClick={left_slide}/>
            </div>
            <div className="arrow-right" onClick={right_slide}>
                    <ArrowRightIcon id="right-icon" onClick={right_slide}/>
            </div>
            {products.map((product,index)=>(
                <div className="slider_container" style={{transform: `translateX(-${slide*100}vw)`}} ref={slide_container} key={index}>
                    <img src={product.src} alt=""/>
                    <div className="slider_info">
                        <h1>{product.title}</h1>
                        <span>
                            {product.desc}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Slider;