import React from "react";
import { Link } from "react-router-dom"
function Folder(props) {
    return (
        <div>
            <button>Return</button>
            <h2>{props.folderName}</h2>
            <input type="text" placeholder="Search" />
            <Link to="/folder/create-note">
                <button>+ Add New Note</button>
            </Link>
            <div style={{display: "flex", flexWrap: "wrap", width:"25%"}}>
                {props.noteName.map((name) => {
                    return <button>{props.noteName[0]}</button>
                })}
            </div>
        </div>
    );
}

export default Folder;
