import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function CustomModal(props) {
  return (
    <>
      <Modal show={props.showModal || false} onHide={props.handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title || "My Modal"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        {props.showFooter && (
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleModal}>
              Close
            </Button>
            <Button variant="primary" onClick={props.handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
