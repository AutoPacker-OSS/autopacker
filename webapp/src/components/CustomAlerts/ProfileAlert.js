import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert } from 'antd';
import { removeAlert } from '../../store/actions/generalActions';

function ProfileAlert() {
  const dispatch = useDispatch();

  // Redux state
  const title = useSelector((state) => state.general.alertTitle);
  const desc = useSelector((state) => state.general.alertDesc);
  const type = useSelector((state) => state.general.alertType);
  const isClosable = useSelector((state) => state.general.isClosable);
  const isEnabled = useSelector((state) => state.general.isEnabled);

  return isEnabled ? (
    <Alert
      message={title}
      description={desc}
      type={type}
      closable={isClosable}
      afterClose={() => dispatch(removeAlert())}
      showIcon
    />
  ) : (
    <div />
  );
}

export default ProfileAlert;
