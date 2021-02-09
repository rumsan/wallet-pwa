import React, { useState } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';

import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import { uploadToIpfs, dataURLtoFile } from '../../utils';
const IPFS_VIEW_URL = 'https://ipfs.io/ipfs';

const videoConstraints = {
	width: '100%',
	height: 400,
	facingMode: 'user'
};

export default function Index() {
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const toggleCameraModal = () => {
		setCameraModal(!cameraModal);
	};

	const webcamRef = React.useRef(null);

	const handleUploadClick = () => {
		const file = dataURLtoFile(previewImage);
		uploadToIpfs(file)
			.then(res => {
				Swal.fire(
					'SUCCESS',
					`Document uploaded successfully. Copy this link to view ${IPFS_VIEW_URL}/${res.path}`,
					'success'
				);
				setPreviewImage('');
			})
			.catch(err => {
				Swal.fire('ERROR', err.error.message, 'error');
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
				<div className="section full mt-2">
					<div className="section-title" style={{ fontSize: 'larger' }}>
						{/* Upload your documents */}
						<div className="text-center mt-3">
							<button
								onClick={toggleCameraModal}
								type="button"
								style={{ margin: 5 }}
								className="btn btn-success btn-md"
								id="btnMnemonic"
							>
								<ion-icon name="camera-outline"></ion-icon> Take a picture to upload
							</button>
						</div>
					</div>

					<div className="content-header mb-05">
						{/* <p>One word in each box</p> */}
						<div className="row">
							{previewImage && (
								<div>
									<img height="400" src={previewImage} alt="Upload doc" />
									<br />
									<div className="text-center">
										<button
											onClick={handleUploadClick}
											type="button"
											style={{ margin: 5 }}
											className="btn btn-primary btn-md"
											id="btnUploadDoc"
										>
											Upload Now
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
