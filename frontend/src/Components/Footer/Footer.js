import React from 'react';
import playStore from "../../images/playstore.png";
import appStore from "../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <img src={playStore} alt="playstore"/>
                <img src={appStore} alt="Appstore"/>
            </div>

            <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority</p>
                <p>Copyrights 2021 &copy; Sourabh Shukla</p>
            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="http://instagram.com/meabhisingh">Instagram</a>
                <a href="http://youtube.com/6packprogrammer">YouTube</a>
                <a href="http://instagram.com/meabhisingh">Facebook</a>
            </div>
        </footer>
    )
}

export default Footer;