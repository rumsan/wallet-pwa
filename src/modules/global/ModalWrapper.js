import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ModalWrapper(props) {
	const { showModal, title, handleModal } = props;
	return (
		<>
			<Modal show={showModal || false} onHide={handleModal}>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: 14 }}>{title || 'My Modal'}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{props.children}</Modal.Body>
				{props.showFooter && (
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModal}>
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
