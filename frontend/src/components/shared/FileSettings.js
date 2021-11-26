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
            <Heading as="h3" size="lg">Choose Color</Heading>
            <RadioGroup value={props.color} onChange={handleColorChange}>
                <Stack>
                    <Radio value="C83E4D" color="brand.500">Brick Red</Radio>
                    <Radio value="F4B860">Sunray</Radio>
                    <Radio value="F4D6CC">Silk</Radio>
                </Stack>
            </RadioGroup>
            <PrivateNote 
                data={disablePassword} 
                setIsPrivate={props.setIsPrivate}
                setPasswordA={props.setPasswordA}
                setPasswordB={props.setPasswordB}/>
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
            <Checkbox onChange={() => handleDisablePassword()}>Set as private?</Checkbox>
            <PasswordForm 
                disablePassword={disablePassword} 
                setPasswordA={props.setPasswordA} 
                setPasswordB={props.setPasswordB}/>
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
