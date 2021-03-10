import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function ImageViewer(props) {
	const { showModal, handleDownloadClick, children, handleModal, documentName } = props;
	return (
		<>
			<Modal
				className="modal fade stories"
				id="StoryDefault"
				tabIndex={-1}
				role="dialog"
				show={showModal}
				onHide={handleModal}
				size="lg"
			>
				<Modal.Body style={{ padding: 0 }}>{children}</Modal.Body>
				<Modal.Footer style={{ padding: 0 }}>
					<p>{documentName}</p>
					<a
						title="Download"
						onClick={e => handleDownloadClick(e)}
						href="#download"
						className="profile-detail"
					>
						<ion-icon size="large" name="arrow-down-circle-outline"></ion-icon>{' '}
					</a>
				</Modal.Footer>
			</Modal>
		</>
	);
}

ImageViewer.propTypes = {
	handleModal: PropTypes.func.isRequired,
	showModal: PropTypes.bool.isRequired
};
