import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2';

import AppHeader from '../layouts/AppHeader';
import ModalWrapper from '../../modules/global/ModalWrapper';
import ActionButton from './actionButton';
import ImageViewer from '../../modules/global/ImageViewer';

import { uploadToIpfs, dataURLtoFile, base64ToBlob, blobToBase64 } from '../../utils';
import { DB } from '../../constants';
import docImg from '../../assets/images/doc.png';

// const IPFS_VIEW_URL = 'http://127.0.0.1:8080/ipfs';

export default function Index() {
	const [cameraModal, setCameraModal] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [imageViewModal, setImageViewModal] = useState(false);
	const [currentDocument, setCurrentDocument] = useState(''); // Viewing current document file base64 url
	const [currentDocumentName, setCurrentDocumentName] = useState(''); // Viewng current document name
	const [videoConstraints, setVideoConstraints] = useState({
		width: 1080,
		height: 500,
		facingMode: 'environment'
	});
	const [imagePreviewModal, setImagePreviewModal] = useState(false);
	const [documentName, setDocumentName] = useState('');
	const [blobFile, setBlobFile] = useState('');

	const [dbContext, setDbContext] = useState(null);
	const [myDocuments, setMyDocuments] = useState([]);

	const handleDocumentNameChange = e => {
		setDocumentName(e.target.value);
	};

	const toggleImageViewModal = (e, base64Url, docName) => {
		if (e) e.preventDefault();
		setCurrentDocumentName(docName);
		setCurrentDocument(base64Url);
		setImageViewModal(!imageViewModal);
	};

	const toggleCameraModal = () => {
		setCameraModal(!cameraModal);
	};

	const toggleImagePreviewModal = () => {
		setDocumentName('');
		setImagePreviewModal(!imagePreviewModal);
	};

	const webcamRef = React.useRef(null);

	const handleDocumentSubmit = e => {
		e.preventDefault();
		const file = dataURLtoFile(previewImage);
		uploadToIpfs(file)
			.then(res => {
				saveDocument(res.path);
				toggleImagePreviewModal();
				Swal.fire('SUCCESS', 'Document uploaded successfully', 'success');
				setPreviewImage('');
				setDocumentName('');
			})
			.catch(err => {
				Swal.fire('ERROR', 'Document upload failed', 'error');
				setPreviewImage('');
				setDocumentName('');
			});
	};

	const handleFaceChange = () => {
		const { facingMode } = videoConstraints;
		const face = facingMode === 'environment' ? 'user' : 'environment';
		setVideoConstraints({ ...videoConstraints, facingMode: face });
	};

	const handleCaptureAgain = e => {
		e.preventDefault();
		toggleImagePreviewModal();
		toggleCameraModal();
	};

	const capture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		base64ToBlob(imageSrc)
			.then(blob => {
				setBlobFile(blob);
				setPreviewImage(imageSrc);
				toggleCameraModal();
				toggleImagePreviewModal();
			})
			.catch(err => {
				Swal.fire('ERROR', 'Image capture failed', 'error');
			});
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

	const saveDocument = docId => {
		let payload = {
			docId: docId,
			docName: documentName,
			file: blobFile,
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
				const { docId, docName, file } = cursor.value;
				if (file) {
					blobToBase64(file).then(d => {
						let doc = { docId, docName, file: d };
						myDocs.push(doc);
					});
				}
				cursor.continue();
			}
			setTimeout(() => {
				setMyDocuments(myDocs);
			}, 1000);
		};
	};

	const handleDownloadClick = e => {
		e.preventDefault();
		return downloadFile(currentDocument);
	};

	function downloadFile(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement('a');
			tag.href = imageUrl;
			tag.download = currentDocumentName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.send();
	}

	const handleRemoveDocClick = () => {
		console.log('HELLO');
	};

	useEffect(initDatabase, []);

	return (
		<>
			<ImageViewer
				handleRemoveDocClick={handleRemoveDocClick}
				handleDownloadClick={handleDownloadClick}
				showModal={imageViewModal}
				handleModal={toggleImageViewModal}
				documentName={currentDocumentName}
			>
				<div role="document">
					<div className="modal-content">
						<div className="story-image">
							<img width="100%" src={currentDocument} alt="My document" />
						</div>
					</div>
				</div>
			</ImageViewer>
			<ModalWrapper modalSize="lg" title="" showModal={imagePreviewModal} handleModal={toggleImagePreviewModal}>
				<img
					style={{ minHeight: 350, maxHeight: 450 }}
					className="card-img-top"
					src={previewImage ? previewImage : docImg}
					alt="My doc"
				/>
				<div className="section mt-4 mb-5">
					<form onSubmit={e => handleDocumentSubmit(e)}>
						<div className="form-group basic">
							<div className="input-wrapper">
								<label className="label" htmlFor="documentName">
									Document Name
								</label>
								<input
									type="text"
									className="form-control"
									name="documentName"
									id="documentName"
									onChange={handleDocumentNameChange}
									value={documentName}
									placeholder="Enter short document name"
									required
								/>
								<i className="clear-input">
									<ion-icon name="close-circle" />
								</i>
							</div>
						</div>

						<div className="form-links mt-2">
							<div>
								<a href="#capture" onClick={e => handleCaptureAgain(e)}>
									Capture another?
								</a>
							</div>
						</div>

						<div className="mt-2">
							<button type="submit" className="btn btn-primary btn-block btn-lg">
								Save
							</button>
						</div>
					</form>
				</div>
			</ModalWrapper>
			<ModalWrapper modalSize="lg" title="" showModal={cameraModal} handleModal={toggleCameraModal}>
				<Webcam
					audio={false}
					height={videoConstraints.height}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					width="100%"
					videoConstraints={videoConstraints}
				/>
				<div className="text-center">
					<button type="button" className="btn btn-text-primary rounded shadowed mr-1 mb-1" onClick={capture}>
						&nbsp; &nbsp;<ion-icon name="camera-outline"></ion-icon>
					</button>
					&nbsp;
					<button
						type="button"
						className="btn btn-text-primary rounded shadowed mr-1 mb-1"
						onClick={handleFaceChange}
					>
						&nbsp; &nbsp; <ion-icon name="camera-reverse-outline"></ion-icon>
					</button>
				</div>
			</ModalWrapper>
			<AppHeader currentMenu="Vault" />
			<div id="appCapsule">
				<div className="container">
					<div className="section full mt-2">
						<form>
							<div className="content-header mb-05">
								<div className="row" style={{ marginBottom: 30 }}>
									{myDocuments.length > 0 &&
										myDocuments.map(doc => {
											return (
												<div key={doc.docId} className="col-sm-3" style={{ marginTop: 15 }}>
													<div
														className="card"
														onClick={e => toggleImageViewModal(e, doc.file, doc.docName)}
													>
														<img
															style={{ borderRadius: '6px' }}
															className="card-img-top"
															src={doc.file}
															alt="My doc"
															height="282"
														/>
													</div>
												</div>
											);
										})}
									<ActionButton
										btnText="Take a picture to upload"
										imageUrl={docImg}
										handleClick={toggleCameraModal}
										iconName="add-outline"
									/>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
