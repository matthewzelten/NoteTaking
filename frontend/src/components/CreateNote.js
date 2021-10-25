import React, { useState } from 'react'

function CreateNote() {
    const [disablePassword, setDisablePassword] = useState(true)
    
    return (
        <div>
            <h1>Add New Note</h1>
            <input type="text" placeholder="Enter Note Name"/>
            <div>
                <h2>
                    Choose Color
                    <p class="create-space" style={{'color':'blue'}}>
                        blue
                        <input class="create-space" type="checkbox" />
                    </p>
                    <p class="create-space" style={{'color':'green'}}>
                        green
                        <input class="create-space" type="checkbox" />
                    </p>
                    <p class="create-space" style={{'color':'red'}}>
                        red
                        <input class="create-space" type="checkbox" />
                    </p>
                </h2>
            </div>
            <div>
                <h2>
                    Set as private note?   
                    <input class="create-space" type="checkbox" onClick={() => setDisablePassword(!disablePassword)}/>
                </h2>
            </div>
            <input disabled={disablePassword} type="text" placeholder="Enter Password"/>
            <input disabled={disablePassword} type="text" placeholder="Confirm Password"/>

            <button> Create Note </button>
        </div>
    )
}

export default CreateNote
