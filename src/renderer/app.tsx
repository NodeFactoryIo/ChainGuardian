import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {AppContainer} from "react-hot-loader";
import {init as initBLS} from "@chainsafe/bls";

import {initSentry} from "../main/sentry";
import Application from "./containers/Application";
import "./style/index.scss";
import store from "./ducks/store";
import {mainLogger} from "../main/logger";
import {Overlays} from "./overlays";

initSentry();

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element): void => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
                <Overlays />
            </Provider>
        </AppContainer>,
        mainElement,
    );
};

initBLS("herumi")
    .then(() => {
        try {
            render(Application);
        } catch (e) {
            mainLogger.error(e);
        }
    })
    .catch((e) => mainLogger.error(e));
