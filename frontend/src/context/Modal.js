import React, { useRef, useState, useContext } from 'react'
import ReactDOM from 'react-dom'
import './Modal.css';

const ModalContext = React.createContext()

export function ModalProvider({ children }) {
    const modalRef = useRef()
    const [modalContent, setModalContent] = useState(null)
    const [onModalClose, setOnModalClose] = useState(null)

    const closeModal = () => {
        setModalContent(null);

        if (typeof onModalClose === 'function') {
            setOnModalClose(null);
            onModalClose()
        }
    }


    const contextValue = {
        modalRef,
        modalContent,
        setModalContent,
        setOnModalClose,
        closeModal,
    }

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    )
}

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext)
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;
    // onClick={closeModal}
    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background"  />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    );
}

// export function ModalDelete() {
//     const { modalRef, modalContent, closeModal } = useContext(ModalContext)
//     // If there is no div referenced by the modalRef or modalContent is not a
//     // truthy value, render nothing:
//     if (!modalRef || !modalRef.current || !modalContent) return null;

//     // Render the following component to the div referenced by the modalRef
//     return ReactDOM.createPortal(
//         <div id="modalDelete">
//             <div id="modal-backgroundDelete" onClick={closeModal} />
//             <div id="modal-content">{modalContent}</div>
//         </div>,
//         modalRef.current
//     );
// }


export const useModal = () => useContext(ModalContext)
