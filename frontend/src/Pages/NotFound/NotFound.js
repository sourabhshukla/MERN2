import React from 'react';
import "./NotFound.css";
import ErrorIcon from "@mui/icons-material/Error";
import {Link, Typography} from "@mui/material";

const NotFound = () => {
    return (
        <div className="PageNotFound">
            <ErrorIcon />

            <Typography>Page Not Found </Typography>
            <Link to="/">Home</Link>
        </div>
    );
};

export default NotFound;