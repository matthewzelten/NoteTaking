import React, { useState } from 'react'

function CreateFolder() {
    const [privateNote, setPrivateNote] = useState(false)
    return (
        <div>
            <h1>Add New Note</h1>
            <input type="text" placeholder="Enter Note Name"/>
            <div>
                <h2>Choose Color</h2>
            </div>
            <div>
                <h2>Set as private note?</h2>
                <input type="checkbox" onClick={() => setPrivateNote(!privateNote)}/>
            </div>
            <input disabled={!privateNote} type="text" placeholder="Enter Password"/>
            <input disabled={!privateNote} type="text" placeholder="Confirm Password"/>
        </div>
    )
}

export default CreateFolder
