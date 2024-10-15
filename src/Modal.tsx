import { createPortal } from "react-dom";

interface ModalProps {
  isVisible: boolean;
  isLoading: boolean;
  confirmAction: () => void;
  cancelAction: () => void;
}

const mountElement = document.getElementById("overlay")!;

const Modal = ({
  isVisible,
  isLoading,
  confirmAction,
  cancelAction,
}: ModalProps) => {
  return (
    (isVisible || isLoading) &&
    createPortal(
      <div
        className={`fixed left-0 top-0 z-10 flex h-full w-full justify-center overflow-auto bg-black/10 align-middle ${isVisible ? "!translate-y-full !opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="relative m-auto text-black">
          {!isLoading && (
            <div className="border-2 bg-white pb-2 pl-4 pr-4 pt-2">
              <h1>Confirm Delete?</h1>
              <button onClick={confirmAction}>Confirm</button>
              <button onClick={cancelAction}>Cancel</button>
            </div>
          )}
          {isLoading && (
            <button type="button" className="relative bg-indigo-500" disabled>
              <svg
                className="... mr-3 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
              ></svg>
              Processing...
            </button>
          )}
        </div>
      </div>,
      mountElement,
    )
  );
};

export default Modal;
