import { Form, Input, Modal } from 'antd';
import React from 'react';
import { useModals } from '../../context/ModalContext';
import Paragraph from 'antd/es/typography/Paragraph';

export const GenericModal = ({ title, description, cancelText, cancel, okText, okButtonProps, ok, jsx }) => {
  const { closeModal } = useModals();

  return (
    <Modal
      title={title || ''}
      centered
      visible={true}
      onOk={ok || closeModal}
      okButtonProps={okButtonProps || null}
      okText={okText || 'Ok'}
      onCancel={cancel || closeModal}>
      {description !== null || description !== '' ? <Paragraph>{description}</Paragraph> : null}
      {jsx !== null || jsx !== '' ? jsx : null}
    </Modal>
  );
};
