import { ComponentType, ReactNode } from 'react';

export interface ModalStackValue {
  /**
   * Opens a modals using the provided component and props
   */
  openModal?: <T extends StackedModalProps, P extends T>(
    component: ComponentType<T>,
    props?: Omit<P, keyof StackedModalProps>,
    options?: OpenModalOptions,
  ) => any;

  /**
   * Closes the active modals
   */
  closeModal?: () => void;

  /**
   * Closes the number of modals
   */
  closeModals?: (amount?: number) => void;

  /**
   * Closes all modals
   */
  closeAllModals?: () => void;

  stack: StackedModal[];
}

export type OpenModalOptions = {
  /**
   * Replaces the active modals in the stack
   */
  replace?: boolean;
};

export interface StackedModalProps {
  open?: boolean;
}

export type StackedModal = {
  component: ComponentType;
  props: any;
};

export interface ModalStackProps {
  renderModals?: ComponentType<ModalStackValue>;
  children?: ReactNode;
}
