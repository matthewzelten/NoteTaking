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
            <input class="create-space" type="checkbox" />
          </p>
          <p class="create-space" style={{ color: "green" }}>
            green
            <input class="create-space" type="checkbox" />
          </p>
          <p class="create-space" style={{ color: "red" }}>
            red
            <input class="create-space" type="checkbox" />
          </p>
        </h2>
      </div>
      <PrivateNote data={disablePassword} />
    </div>
  );
}

function PrivateNote(props) {
  const [disablePassword, setDisablePassword] = useState(true);
  if (disablePassword) {
    return (
      <div>
        <h2>
          Set as private?
          <button onClick={() => setDisablePassword(!disablePassword)}>
            yes
          </button>
          <input
            class="create-space"
            type="checkbox"
            onClick={() => setDisablePassword(!disablePassword)}
          />
        </h2>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <h2>
            Set as private?
            <button onClick={() => setDisablePassword(!disablePassword)}>
              no
            </button>
            <input
              class="create-space"
              type="checkbox"
              onClick={() => setDisablePassword(!disablePassword)}
            />
          </h2>
        </div>
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
  }
}

export default FileSettings;
