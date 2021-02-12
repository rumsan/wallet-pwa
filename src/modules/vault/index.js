import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import ActionButton from './actionButton';

import { uploadToIpfs, dataURLtoFile } from '../../utils';
import { DB } from '../../constants';
import { encryptData, decryptData } from '../../utils/crypto';
import docImg from '../../assets/images/doc.png';

const IPFS_VIEW_URL = 'http://127.0.0.1:8080/ipfs';
const videoConstraints = {
	width: '100%',
	height: 400,
	facingMode: 'user'
};

export default function Index() {
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	const [dbContext, setDbContext] = useState(null);
	const [myDocuments, setMyDocuments] = useState([]);

	const toggleCameraModal = () => {
		setCameraModal(!cameraModal);
	};

	const webcamRef = React.useRef(null);

	const handleUploadClick = () => {
		const file = dataURLtoFile(previewImage);
		uploadToIpfs(file)
			.then(res => {
				let encryptedHash = encryptData(res.path);
				saveDocument(encryptedHash);
				Swal.fire('SUCCESS', 'Document uploaded successfully', 'success');
				setPreviewImage('');
			})
			.catch(err => {
				Swal.fire('ERROR', 'Document upload failed', 'error');
				setPreviewImage('');
			});
	};

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		setPreviewImage(imageSrc);
		toggleCameraModal();
	};

	const initDatabase = () => {
		let request = window.indexedDB.open(DB.NAME, DB.VERSION);
		request.onupgradeneeded = e => {
			let db = request.result;
			// Create db tables here
			db.createObjectStore(DB.TABLES.DOCUMENTS, { keyPath: 'docId' });
		};
		request.onerror = e => {
			Swal.fire('ERROR', e.target.errorCode, 'error');
		};
		request.onsuccess = e => {
			let db = request.result;
			setDbContext(db);
			fetchDocuments(db);
		};
	};

	const saveDocument = file => {
		let payload = {
			docId: uuidv4(),
			docName: file,
			createdAt: Date.now()
		};
		const request = dbContext
			.transaction([DB.TABLES.DOCUMENTS], 'readwrite')
			.objectStore(DB.TABLES.DOCUMENTS)
			.add(payload);

		request.onsuccess = function (e) {
			console.log('Success');
			fetchDocuments(dbContext);
		};
		request.onerror = function (e) {
			Swal.fire('ERROR', e.target.errorCode, 'error');
		};
	};

	const fetchDocuments = db => {
		let myDocs = [];
		let objectStore = db.transaction(DB.TABLES.DOCUMENTS).objectStore(DB.TABLES.DOCUMENTS);
		objectStore.openCursor().onsuccess = function (e) {
			let cursor = e.target.result;
			if (cursor) {
				const { docId, docName } = cursor.value;
				const decryptedHash = decryptData(docName);
				let doc = { docId, docName: decryptedHash };
				myDocs.push(doc);
				cursor.continue();
			}
			setTimeout(() => {
				setMyDocuments(myDocs);
			}, 1000);
		};
	};

	useEffect(initDatabase, []);

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
							My documents
						</div>
						<form>
							<div className="content-header mb-05">
								<p>Manage your documents</p>
								<div className="row" style={{ marginBottom: 30 }}>
									{previewImage ? (
										<ActionButton
											btnText="Upload Now"
											imageUrl={previewImage}
											handleClick={handleUploadClick}
											iconName="cloud-upload-outline"
										/>
									) : (
										<ActionButton
											btnText="Take a picture to upload"
											imageUrl={docImg}
											handleClick={toggleCameraModal}
											iconName="add-outline"
										/>
									)}
									{myDocuments.length > 0 &&
										myDocuments.map(doc => {
											return (
												<div key={doc.docId} className="col-sm-3" style={{ marginTop: 15 }}>
													<div className="card">
														<img
															className="card-img-top"
															src={`${IPFS_VIEW_URL}/${doc.docName}`}
															alt="My doc"
														/>
														<div className="card-body text-center">
															<button type="button" className="btn btn-primary">
																Download
															</button>
														</div>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
