import styles from "./modal.module.scss";
import { Fragment } from "react";

const Modal = (props) => {
  if (props.modalOpen) {
    return (
      <Fragment>
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              props.setModalOpen(false);
            }
          }}
          className={styles.popup}
        >
          <div className={styles.box}>{props.children}</div>
        </div>
      </Fragment>
    );
  } else {
    return null;
  }
};

export default Modal;
