import React from 'react';
import { Modal } from 'react-bootstrap';

export default function Loading({ showModal, message }) {
	return (
		<>
			<Modal style={{ marginTop: 100 }} show={showModal || false}>
				<Modal.Body>{message || 'Please wait...'}</Modal.Body>
			</Modal>
		</>
	);
}
