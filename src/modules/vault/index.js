import React, { useState } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';

import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import { uploadToIpfs, dataURLtoFile } from '../../utils';
const IPFS_VIEW_URL = 'https://ipfs.io/ipfs';

const videoConstraints = {
	facingMode: 'user'
};

export default function Index() {
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const [ipfsUrl, setIpfsUrl] = useState('');

	const toggleCameraModal = () => {
		setCameraModal(!cameraModal);
	};

	const webcamRef = React.useRef(null);

	const handleUploadClick = () => {
		const file = dataURLtoFile(previewImage);
		uploadToIpfs(file)
			.then(res => {
				const full_path = `${IPFS_VIEW_URL}/${res.path}`;
				setIpfsUrl(full_path);
				Swal.fire('SUCCESS', `Document uploaded successfully. Copy this link to view ${full_path}`, 'success');
				setPreviewImage('');
			})
			.catch(err => {
				console.log('ERR:', err);
				Swal.fire('ERROR', 'Document upload failed', 'error');
				setPreviewImage('');
			});
	};

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setPreviewImage(imageSrc);
		toggleCameraModal();
	};
	return (
		<>
			<ModalWrapper modalSize="lg" title="Take a picture" showModal={cameraModal} handleModal={toggleCameraModal}>
				<div style={{ padding: 10 }}>
					<Webcam
						audio={false}
						height={400}
						ref={webcamRef}
						screenshotFormat="image/jpeg"
						width="100%"
						videoConstraints={videoConstraints}
					/>
					<div className="text-center">
						<button className="btn btn-primary" onClick={capture}>
							Capture photo
						</button>
					</div>
				</div>
			</ModalWrapper>
			<AppHeader currentMenu="Vault" />
			<div id="appCapsule">
				<div className="container">
					<div className="section full mt-2">
						<div className="section-title" style={{ fontSize: 'larger' }}>
							{/* Upload your documents */}
							<div className="text-center mt-3">
								<button
									onClick={toggleCameraModal}
									type="button"
									className="btn btn-success btn-md"
									id="btnMnemonic"
								>
									<ion-icon name="camera-outline"></ion-icon> Take a picture to upload
								</button>
							</div>
						</div>

						<div className="content-header mb-05">
							<div className="row">
								{previewImage && (
									<div className="card" style={{ width: '50%' }}>
										<img className="card-img-top" src={previewImage} alt="Card  cap" />
										<div className="card-body">
											<div className="text-center">
												<button
													onClick={handleUploadClick}
													type="button"
													className="btn btn-primary btn-md"
													id="btnUploadDoc"
												>
													Upload Now
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="section full mt-2">
						<div className="section-title" style={{ fontSize: 'larger' }}>
							My documents
						</div>
						<form>
							<div className="content-header mb-05">
								<p>Manage your documents</p>
								<div className="row" style={{ marginBottom: 30 }}>
									<div className="col-sm-3">
										<div className="card">
											<img
												className="card-img-top"
												src={ipfsUrl ? ipfsUrl : 'https://via.placeholder.com/150'}
												alt="My doc"
											/>
											<div className="card-body text-center">
												<button type="button" className="btn btn-primary">
													Download
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
