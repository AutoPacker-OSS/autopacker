import React from "react";
import {ModalStack} from "../src/context/ModalContext";

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
}

export const decorators = [
    (Story) => (
        <div style={{ margin: "1em"}}>
           <ModalStack>
               <Story />
           </ModalStack>
        </div>
    )
];