import React from 'react';
import { GenericModal } from './GenericModal';
import { Button } from 'antd';
import { useModals } from '../../context/ModalContext';

export default {
  title: 'components/Modals',
  component: [GenericModal],
};
export const Default = () => {
  const { openModal, closeModal } = useModals();

  const openGenericModal = () => {
    openModal(GenericModal, {
      title: 'Modal Title',
      description: 'Modal Description',
      okText: 'Yes',
      ok: openAnotherGenericModal,
      cancel: closeModal,
      cancelText: 'Close',
    });
  };

  const openAnotherGenericModal = () => {
    openModal(GenericModal, {
      title: 'Another Modal',
      okButtonProps: { disabled: true },
      jsx: <p>This one takes in JSX! And has a button props property!</p>,
    });
  };

  return (
    <>
      <Button onClick={openGenericModal}>Open generic modal</Button>
    </>
  );
};
