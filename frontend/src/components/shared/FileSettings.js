import React, { useState } from "react";

function FileSettings(props) {
  const [disablePassword, setDisablePassword] = useState(true);
  return (
    <div>
      <div>
        <h2>
          Choose Color
          <p class="create-space" style={{ color: "blue" }}>
            blue
            <input class="create-space" name="color" type="radio" />
          </p>
          <p class="create-space" style={{ color: "green" }}>
            green
            <input class="create-space" name="color" type="radio" />
          </p>
          <p class="create-space" style={{ color: "red" }}>
            red
            <input class="create-space" name="color" type="radio" />
          </p>
        </h2>
      </div>
      <PrivateNote data={disablePassword} />
    </div>
  );
}

function PrivateNote(props) {
  const [disablePassword, setDisablePassword] = useState(true);
  return (
    <div>
      <h2>
        Set as private?
        <input
          class="create-space"
          type="checkbox"
          onClick={() => setDisablePassword(!disablePassword)}
        />
        <PasswordForm disablePassword={disablePassword}/>
      </h2>
    </div>
  );
}

function PasswordForm({disablePassword}){
  if(!disablePassword) {
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
    )
  }
  else {
    return (
      <div></div>
    )
  }
}

export default FileSettings;
