import { ALERT_SETUP, ALERT_CLEAR, MENU_SELECT, SUB_MENU_TOGGLE } from '../actions/actionTypes';

const setupAlert = (title, desc, type, isClosable) => {
  return {
    type: ALERT_SETUP,
    alertTitle: title,
    alertDesc: desc,
    alertType: type,
    isClosable: isClosable,
  };
};

const clearAlert = () => {
  return {
    type: ALERT_CLEAR,
  };
};

const selectSidebarMenuOption = (menuKey) => {
  return {
    type: MENU_SELECT,
    menuKey: menuKey,
  };
};

const selectSubMenuOption = (subMenuKey) => {
  return {
    type: SUB_MENU_TOGGLE,
    subMenuKey: subMenuKey,
  };
};

export const createAlert = (title, desc, type, isClosable) => {
  return (dispatch) => {
    dispatch(setupAlert(title, desc, type, isClosable));
  };
};

export const removeAlert = () => {
  return (dispatch) => {
    dispatch(clearAlert());
  };
};

export const selectMenuOption = (menuKey) => {
  return (dispatch) => {
    dispatch(selectSidebarMenuOption(menuKey));
  };
};

export const toggleSubMenuOption = (subMenuKey) => {
  return (dispatch) => {
    dispatch(selectSubMenuOption(subMenuKey));
  };
};
