import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import GFolder from '../../utils/google/gfolder';
import GFile from '../../utils/google/gfile';
import { getEncryptedWallet, saveBackupDocs, getBackupDocs, clearBackupDocs } from '../../utils/sessionManager';
import { DB } from '../../constants';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GDriveFolderName = 'RumsanWalletBackup';
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleBackup() {
	const loadGapiClient = () => {
		initDatabase();
		gapi.load('client:auth2', initClient);
	};

	const [showHomeButton, setShowHomeButton] = useState(false);
	const [progressMessage, setProgressMessage] = useState('Initializing google backup...');
	const [loading, setLoading] = useState(false);
	const [progressWidth, setProgressWidth] = useState(0);

	const updateSigninStatus = isSignedIn => {
		let user = null;
		if (isSignedIn) {
			user = gapi.auth2.getAuthInstance().currentUser.je.Qt;
		} else {
			user = handleUserSignIn(); // Prompt signin
		}
		if (user) {
			return createBackup();
		}
	};

	const createBackup = async () => {
		try {
			const backupDocs = getBackupDocs();
			setLoading(true);
			const gFolder = new GFolder(gapi);
			const gFile = new GFile(gapi);
			let encWallet = getEncryptedWallet();
			encWallet = JSON.parse(encWallet);
			const backupData = { name: 'rumsan-wallet', wallet: encWallet, type: 'ethereum' };

			setProgressWidth(25);
			const folder = await gFolder.ensureExists(GDriveFolderName);
			setProgressMessage('Checking if previous backup exists...');
			const file = await gFile.getByName(encWallet.address, folder.id);
			setProgressWidth(50);
			// if (file.exists) {
			// 	setProgressWidth(100);
			// 	setProgressMessage('Backup already exists in Google Drive.');
			// 	setShowHomeButton(true);
			// 	setLoading(false);
			// } else {

			// }

			if (file.exists) {
				setProgressWidth(100);
				setProgressMessage('Backup already exists in Google Drive.');
				setShowHomeButton(true);
				setLoading(false);
			} else {
				setProgressMessage('Previous backup not found. Fetching new wallet....');
				setProgressWidth(60);
				const encWallet = getEncryptedWallet();
				if (!encWallet) throw new Error('No wallet available to backup!');
				const backupData = { wallet: JSON.parse(encWallet) };
				if (backupDocs && backupDocs.length) backupData.myDocuments = backupDocs;
				setProgressWidth(80);
				setProgressMessage('Backing up encrypted wallet to Google Drive...');
				await gFile.createFile({
					name: encWallet.address,
					data: JSON.stringify(backupData),
					parentId: folder.id
				});
				setLoading(false);
				setProgressMessage('Wallet backed up successfully.');
				setShowHomeButton(true);
				setProgressWidth(100);
			}

			setProgressMessage('Previous backup not found. Fetching new wallet....');
			setProgressWidth(60);
			if (!encWallet) throw new Error('No wallet available to backup!');
			setProgressWidth(80);
			setProgressMessage('Backing up encrypted wallet to Google Drive...');
			await gFile.createFile({
				name: encWallet.address,
				data: JSON.stringify(backupData),
				parentId: folder.id
			});
			setLoading(false);
			setProgressMessage('Wallet backed up successfully.');
			setShowHomeButton(true);
			setProgressWidth(100);
		} catch (e) {
			Swal.fire('ERROR', e.message, 'error');
		} finally {
			clearBackupDocs();
		}
	};

	const handleUserSignIn = () => {
		return gapi.auth2.getAuthInstance().signIn();
	};

	const initClient = () => {
		gapi.client
			.init({
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				ux_mode: 'redirect',
				scope: 'profile email https://www.googleapis.com/auth/drive',
				redirect_uri: `${GOOGLE_REDIRECT_URL}/backup`
			})
			.then(
				function () {
					// Listen for sign-in state changes.
					gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
					// Handle the initial sign-in state.
					updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
				},
				function (error) {}
			);
	};

	const initDatabase = () => {
		let request = window.indexedDB.open(DB.NAME, DB.VERSION);
		request.onupgradeneeded = e => {
			let db = request.result;
			db.createObjectStore(DB.TABLES.DOCUMENTS, { keyPath: 'docId' });
		};
		request.onerror = e => {
			Swal.fire('ERROR', e.target.errorCode, 'error');
		};
		request.onsuccess = e => {
			let db = request.result;
			fetchDocuments(db);
		};
	};

	const fetchDocuments = db => {
		let myDocs = [];
		let objectStore = db.transaction(DB.TABLES.DOCUMENTS).objectStore(DB.TABLES.DOCUMENTS);
		objectStore.openCursor().onsuccess = function (e) {
			let cursor = e.target.result;
			if (cursor) {
				const { docId, docName } = cursor.value;
				let doc = { docId, docName };
				myDocs.push(doc);
				cursor.continue();
			}
			setTimeout(() => {
				saveBackupDocs(myDocs);
			}, 1000);
		};
	};

	useEffect(loadGapiClient, []);

	return (
		<div id="appCapsule">
			<div id="cmpMain">
				<div className="section full mt-2">
					<div className="text-center" style={{ marginTop: 100 }}>
						<h4 className="subtitle">{progressMessage}</h4>
					</div>
					<div>
						<div className="progress" style={{ margin: '50px 80px 3px' }}>
							<div
								className="progress-bar"
								style={{ width: `${progressWidth}%` }}
								role="progressbar"
								aria-valuenow={25}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
						<div className="text-center">
							<small className="text-success message" />
						</div>
						<div className="text-center">
							{showHomeButton && (
								<Link to="/" className="btn btn-primary btn-home mt-3">
									Go to Home
								</Link>
							)}
							{loading && <div className="spinner-border text-success mt-5 in-progress" role="status" />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
