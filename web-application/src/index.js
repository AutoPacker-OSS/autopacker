import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { KeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";

// Import reducer(s)
import generalReducer from "./store/reducers/generalReducer";

// Import index style
import "./index.scss";
// Import antd scss
import "antd/dist/antd.css";

const rootReducer = combineReducers({
	general: generalReducer,
});

// TODO Somewhere along the steps below regarding redux, something is fubar

// Logs the redux related state changes (Just for testing)
const loggerMiddleware = () => {
	return (next) => {
		return (action) => {
			const result = next(action);
			return result;
		};
	};
};

// Setting up browser debug support (see https://github.com/zalmoxisus/redux-devtools-extension)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the redux store and adding middleware and such
const reduxStore = createStore(rootReducer, composeEnhancers(applyMiddleware(loggerMiddleware, thunk)));

/**
 * check-sso will only authenticate the client if the user is already logged-in,
 * if the user is not logged-in the browser will be redirected back to the
 * application and remain unauthenticated
 * */
const keycloakProviderInitConfig = {
	onLoad: "check-sso",
};

const app = (
	<KeycloakProvider keycloak={keycloak} initConfig={keycloakProviderInitConfig}>
		<Router>
			<Provider store={reduxStore}>
				<App />
			</Provider>
		</Router>
	</KeycloakProvider>
);

// Render
ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
