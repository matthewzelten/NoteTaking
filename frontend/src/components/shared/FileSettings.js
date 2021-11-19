import { Checkbox } from "@chakra-ui/checkbox";
import { Heading, Stack } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
import { Table, Th, Thead, Tr } from "@chakra-ui/table";
import { Tab } from "@chakra-ui/tabs";
import React, { useState } from "react";

function FileSettings(props) {
    const [disablePassword, setDisablePassword] = useState(true);

    function handleColorChange(selectedColor) {
      props.setColor(selectedColor);
    }

    return (
        <div>
<<<<<<< HEAD
            <Heading as="h3" size="lg">Choose Color</Heading>
            <RadioGroup value={props.color} onChange={handleColorChange}>
                <Stack>
                    <Radio value="C83E4D" color="brand.500">Brick Red</Radio>
                    <Radio value="F4B860">Sunray</Radio>
                    <Radio value="F4D6CC">Silk</Radio>
                </Stack>
            </RadioGroup>
            <PrivateNote data={disablePassword} setIsPrivate={props.setIsPrivate}/>
=======
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
            <PrivateNote data={disablePassword} setPasswordA={props.setPasswordA} setPasswordB={props.setPasswordB} setIsPrivate={props.setIsPrivate} />
>>>>>>> origin/main
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
<<<<<<< HEAD
            <Checkbox onChange={() => handleDisablePassword()}>Set as private?</Checkbox>
            <PasswordForm disablePassword={disablePassword} />
=======
            <h2>
                Set as private?
                <input
                    class="create-space"
                    type="checkbox"
                    onClick={() => handleDisablePassword()}
                />
                <PasswordForm disablePassword={disablePassword} setPasswordA={props.setPasswordA} setPasswordB={props.setPasswordB} />
            </h2>
>>>>>>> origin/main
        </div>
    );
}

function PasswordForm(props) {
    if (!props.disablePassword) {
        return (
            <div>
                <input
                    disabled={props.disablePassword}
                    type="text"
                    placeholder="Enter Password"
                    onChange={(e) => props.setPasswordA(e.target.value)}
                />
                <input
                    disabled={props.disablePassword}
                    type="text"
                    placeholder="Confirm Password"
                    onChange={(e) => props.setPasswordB(e.target.value)}
                />
            </div>
        );
    } else {
        return <div></div>;
    }
}

export default FileSettings;
