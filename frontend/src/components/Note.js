import React from "react";
import PropTypes from "prop-types";

function Note(props) {
  return (
    <div>
      <input style={{ width: "100%", height: "200px" }} placeholder={"Notes"} />
    </div>
  );
}

export default Note;
