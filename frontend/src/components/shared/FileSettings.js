import React, { useState } from "react";

function FileSettings(props) {
    const [disablePassword, setDisablePassword] = useState(true);

    function handleColorChange(selectedColor) {
      props.setColor(selectedColor);
    }
    return (
        <div>
            <div>
              <h2>
                <form>
                    Choose Color
                    <p class="create-space" style={{ color: "blue" }}>
                        blue
                        <input class="create-space" name="color" type="radio" value="0000FF" onClick={() => handleColorChange("0000FF")}/>
                    </p>
                    <p class="create-space" style={{ color: "green" }}>
                        green
                        <input class="create-space" name="color" type="radio" value="00FF00" onClick={() => handleColorChange("00FF00")}/>
                    </p>
                    <p class="create-space" style={{ color: "red" }}>
                        red
                        <input class="create-space" name="color" type="radio" value="FF0000" onClick={() => handleColorChange("FF0000")}/>
                    </p>
                </form>
                </h2>
            </div>
            <PrivateNote data={disablePassword} />
        </div>
    );
}

function PrivateNote(props) {
    const [disablePassword, setDisablePassword] = useState(true);

    function handleDisablePassword() {
        setDisablePassword(!disablePassword)
        props.setIsPrivate(!props.isPrivate)
    }

    return (
        <div>
            <h2>
                Set as private?
                <input
                    class="create-space"
                    type="checkbox"
                    onClick={() => handleDisablePassword()}
                />
                <PasswordForm disablePassword={disablePassword} />
            </h2>
        </div>
    );
}

function PasswordForm({ disablePassword }) {
    if (!disablePassword) {
        return (
            <div>
                <input
                    disabled={disablePassword}
                    type="text"
                    placeholder="Enter Password"
                />
                <input
                    disabled={disablePassword}
                    type="text"
                    placeholder="Confirm Password"
                />
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default FileSettings;
