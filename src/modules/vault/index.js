import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import ActionButton from './actionButton';
import ImageViewer from '../../modules/global/ImageViewer';

import { uploadToIpfs, dataURLtoFile } from '../../utils';
import { DB } from '../../constants';
import { encryptData, decryptData } from '../../utils/crypto';
import docImg from '../../assets/images/doc.png';

const IPFS_VIEW_URL = 'http://127.0.0.1:8080/ipfs';
const videoConstraints = {
	facingMode: 'user'
};

export default function Index() {
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [imageViewModal, setImageViewModal] = useState(false);
	const [currentDocument, setCurrentDocument] = useState('');

	const [dbContext, setDbContext] = useState(null);
	const [myDocuments, setMyDocuments] = useState([]);

	const toggleImageViewModal = (e, docName) => {
		if (e) e.preventDefault();
		setCurrentDocument(docName);
		setImageViewModal(!imageViewModal);
	};

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

	const handleDownloadClick = e => {
		e.preventDefault();
		const url = `${IPFS_VIEW_URL}/${currentDocument}`;
		return downloadFile(url, currentDocument);
	};

	function downloadFile(url, fileName) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement('a');
			tag.href = imageUrl;
			tag.download = fileName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.send();
	}

	useEffect(initDatabase, []);

	return (
		<>
			<ImageViewer
				handleDownloadClick={handleDownloadClick}
				showModal={imageViewModal}
				handleModal={toggleImageViewModal}
			>
				<div role="document">
					<div className="modal-content">
						<div className="story-image">
							<img width="100%" src={`${IPFS_VIEW_URL}/${currentDocument}`} alt="My document" />
						</div>
					</div>
				</div>
			</ImageViewer>
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
									{myDocuments.length > 0 &&
										myDocuments.map(doc => {
											return (
												<div key={doc.docId} className="col-sm-3" style={{ marginTop: 15 }}>
													<div
														className="card"
														onClick={e => toggleImageViewModal(e, doc.docName)}
													>
														<img
															className="card-img-top"
															src={`${IPFS_VIEW_URL}/${doc.docName}`}
															alt="My doc"
															height="282"
														/>
													</div>
												</div>
											);
										})}
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
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
