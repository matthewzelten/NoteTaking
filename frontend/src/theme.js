import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
        global: {
            button: {
                _hover: {
                    color: "black",
                },
            },
        },
    },
    colors: {
        brand: {
            100: "#32292F",
            200: "#216869",
            300: "#F4D6CC",
            400: "#F4B860",
            500: "#C83E4D",
        },
    },
    components: {
        Button: {
            baseStyle: {
                h: "50px",
                border: "0px",
                color: "#32292F",
                margin: "5px",
                _hover: "black"
            },
        },
    },
});

export default theme;
