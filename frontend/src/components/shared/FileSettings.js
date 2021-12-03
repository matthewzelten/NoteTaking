<<<<<<< HEAD
import { Checkbox } from "@chakra-ui/checkbox";
import { Heading, Stack } from "@chakra-ui/layout";
import { Radio, RadioGroup } from "@chakra-ui/radio";
=======
import {
    Checkbox,
    Heading,
    Stack,
    Radio,
    RadioGroup,
    Box,
    Input,
} from "@chakra-ui/react";
>>>>>>> 08e44ae69a5e4027af9180d3fc2bebd93b44805f
import React, { useState } from "react";

function FileSettings(props) {
    const [disablePassword, setDisablePassword] = useState(true);

    function handleColorChange(selectedColor) {
        props.setColor(selectedColor);
    }

    return (
        <Box>
            <Heading as="h3" size="lg">
                Choose Color
            </Heading>
            <RadioGroup value={props.color} onChange={handleColorChange}>
                <Stack>
                    <Radio value="C83E4D">Brick Red</Radio>
                    <Radio value="F4B860">Sunray</Radio>
                    <Radio value="F4D6CC">Silk</Radio>
                </Stack>
            </RadioGroup>
            {props.isFolderCreate && (
                <PrivateNote
                    data={disablePassword}
                    setIsPrivate={props.setIsPrivate}
                    setPasswordA={props.setPasswordA}
                    setPasswordB={props.setPasswordB}
                    isFolderCreate={props.isFolderCreate}
                />
            )}
        </Box>
    );
}

function PrivateNote(props) {
    const [disablePassword, setDisablePassword] = useState(true);

    function handleDisablePassword() {
        setDisablePassword(!disablePassword);
        props.setIsPrivate(!props.isPrivate);
    }

    return (
        <Box>
            <Checkbox onChange={() => handleDisablePassword()}>
                Set as private?
            </Checkbox>
            <PasswordForm
                disablePassword={disablePassword}
                setPasswordA={props.setPasswordA}
                setPasswordB={props.setPasswordB}
            />
        </Box>
    );
}

function PasswordForm(props) {
    const [showPassword, setShowPassword] = useState(false);
    if (!props.disablePassword) {
        return (
            <Box>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => props.setPasswordA(e.target.value)}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    onChange={(e) => props.setPasswordB(e.target.value)}
                />
                <Checkbox onChange={() => setShowPassword(!showPassword)}>
                    Show Password
                </Checkbox>
            </Box>
        );
    } else {
        return <Box></Box>;
    }
}

export default FileSettings;
