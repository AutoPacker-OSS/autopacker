import { ALERT_SETUP, ALERT_CLEAR, MENU_SELECT, SUB_MENU_TOGGLE } from "../actions/actionTypes";
import { updateState } from "../reduxUtil/reduxUtil";

const initialState = {
	// alert state
	alertTitle: null,
	alertDesc: null,
	alertType: null,
	isClosable: null,
	isEnabled: false,

	// sidebar state
	selectedMenuOption: null,
	openedSubMenus: [],
};

const setupAlert = (state, action) => {
	return updateState(state, {
		alertTitle: action.alertTitle,
		alertDesc: action.alertDesc,
		alertType: action.alertType,
		isClosable: action.isClosable,
		isEnabled: true,
	});
};

const clearAlert = (state) => {
	return updateState(state, {
		alertTitle: null,
		alertDesc: null,
		alertType: null,
		isClosable: null,
		isEnabled: false,
	});
};

const selectMenuOption = (state, action) => {
	return updateState(state, {
		selectedMenuOption: action.menuKey,
	});
};

const toggleSubMenu = (state, action) => {
	let openedSubMenus = state.openedSubMenus;
	if (openedSubMenus.length <= 0) {
		openedSubMenus.push(action.subMenuKey);
	} else {
		let found = false;
		for (let i = 0; i < openedSubMenus.length; i++) {
			if (openedSubMenus[i] === action.subMenuKey) {
				found = true;
			}
		}
		if (found === false) {
			openedSubMenus.push(action.subMenuKey);
		} else {
			let arr = [];
			openedSubMenus.forEach((key) => {
				if (key !== action.subMenuKey) {
					arr.push(key);
				}
			});
			openedSubMenus = arr;
		}
	}
	return updateState(state, {
		openedSubMenus: openedSubMenus,
	});
};

const generalReducer = (state = initialState, action) => {
	switch (action.type) {
		case ALERT_SETUP:
			return setupAlert(state, action);

		case ALERT_CLEAR:
			return clearAlert(state);

		case MENU_SELECT:
			return selectMenuOption(state, action);

		case SUB_MENU_TOGGLE:
			return toggleSubMenu(state, action);

		default:
			return state;
	}
};

export default generalReducer;
