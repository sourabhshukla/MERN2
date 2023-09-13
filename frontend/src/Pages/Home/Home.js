import React, {Fragment} from 'react';
import Header from "../../Components/Header/Header";
import Slider from "../../Components/Slider/Slider";
import Categories from "../../Components/Categories/Categories";
import "./Home.css";
import Footer from "../../Components/Footer/Footer";

const Home = () => {
    return (
        <Fragment>
         <Header/>
            <div className="abcd">
                <Slider/>
                <Categories/>
                {/*<Footer/>*/}
            </div>
        </Fragment>
    );
};

export default Home;