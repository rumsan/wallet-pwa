import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ModalWrapper(props) {
	return (
		<>
			<Modal show={props.showModal || false} onHide={props.handleModal}>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: 14 }}>{props.title || 'My Modal'}</Modal.Title>
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

ModalWrapper.propTypes = {
	handleModal: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired
};
