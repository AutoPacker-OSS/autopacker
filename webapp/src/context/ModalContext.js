import React, { createContext, useContext, useMemo, useState } from 'react';

export const ModalStackContext = createContext({});

// TODO Rewrite into typescript (got an existing one already)
export function ModalStack({ children, renderModals: ModalsComponent = Modals }) {
  const [stack, setStack] = useState([]);

  const value = useMemo(() => {
    function pop(amount = 1) {
      return setStack((prev) => [...prev].slice(0, prev.length - amount));
    }

    function dismissAll() {
      setStack([]);
    }

    function dismiss(amount) {
      if (stack.length === 1) {
        dismissAll();
      } else {
        pop(amount);
      }
    }

    return {
      stack,
      openModal: (component, props, options) => {
        setStack((prev) => {
          let newStack = [...prev];

          if (options?.replace) {
            newStack = stack.slice(0, stack.length - 1);
          }

          return [...newStack, { component, props }];
        });
      },
      closeModal: () => dismiss(1),
      closeModals: dismiss,
      closeAllModals: dismissAll,
    };
  }, [stack]);

  return (
    <ModalStackContext.Provider value={value}>
      {children}
      <ModalsComponent {...value} />
    </ModalStackContext.Provider>
  );
}

function Modals({ stack }) {
  return (
    <>
      {stack.map((modal, index) => {
        return <modal.component key={index} open={modal === stack[stack.length - 1]} {...modal.props} />;
      })}
    </>
  );
}

export function useModals() {
  return useContext(ModalStackContext);
}
