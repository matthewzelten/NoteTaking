import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
    return (
        <header class="box alter-height">
            <Link to="/">
                <h1>Notes Made Easy</h1>
            </Link>
        </header>
    );
}

export default Header;
