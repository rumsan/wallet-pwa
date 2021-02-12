import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { ethers } from 'ethers';

import { AppContext } from '../../contexts/AppContext';
import { savePublickey, saveEncyptedWallet } from '../../utils/sessionManager';

import { APP_CONSTANTS } from '../../constants';
import GFolder from '../../utils/google/gfolder';
import GFile from '../../utils/google/gfile';
import Loading from '../global/Loading';

const GDriveFolderName = 'RumsanWalletBackup';
const BackupFileName = 'rumsan.wallet';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function GoogleRestore() {
	const { saveAppWallet } = useContext(AppContext);
	const [progressMessage, setProgressMessage] = useState('Restoring wallet from google drive...');
	const [progressWidth, setProgressWidth] = useState(0);
	const [loading, setLoading] = useState(false);
	const [passcode, setPasscode] = useState('');
	const [encryptedWallet, setEncryptedWallet] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [currentAction, setCurrentAction] = useState('verify_passcode');

	const loadGapiClient = () => {
		gapi.load('client:auth2', initClient);
	};

	const updateSigninStatus = isSignedIn => {
		let user = null;
		if (isSignedIn) user = gapi.auth2.getAuthInstance().currentUser.je.Qt;
		else user = handleUserSignIn();
		if (user) return fetchWallet();
	};

	const fetchWallet = async () => {
		const gFolder = new GFolder(gapi);
		const gFile = new GFile(gapi);
		const folder = await gFolder.ensureExists(GDriveFolderName);
		const file = await gFile.getByName(BackupFileName, folder.id);
		if (file.exists) {
			let data = await gFile.downloadFile(file.firstFile.id);
			const jsonData = JSON.parse(data);
			setEncryptedWallet(jsonData.wallet);
		} else {
			setCurrentAction('restore_wallet');
			setProgressMessage(
				'No backup found in google drive. Please follow the link below to create fresh new wallet.'
			);
			setProgressWidth(100);
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
				redirect_uri: `${GOOGLE_REDIRECT_URL}/restore`
			})
			.then(function () {
				gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
				updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			});
	};

	const handlePasscodeChange = e => {
		const { value } = e.target;
		setPasscode(value);
		if (value.length === PASSCODE_LENGTH) {
			return verifyPasscodeAndRestore(value);
		}
	};

	const verifyPasscodeAndRestore = async passcodeData => {
		try {
			setLoading(true);
			const data = await ethers.Wallet.fromEncryptedJson(
				JSON.stringify(encryptedWallet),
				passcodeData.toString()
			);
			saveEncyptedWallet(JSON.stringify(encryptedWallet));
			setLoading(false);
			setCurrentAction('restore_wallet');
			setProgressWidth(25);
			setProgressMessage('Wallet downloaded. Decrypting wallet...');
			const { privateKey, address } = data;
			setProgressWidth(50);
			savePublickey(address);
			saveAppWallet({ privateKey, address });
			setProgressMessage('Wallet restored successfully.');
			setProgressWidth(100);
			setPasscode('');
		} catch (e) {
			setPasscode('');
			setErrorMsg('Please enter correct passcode.');
			setLoading(false);
		}
	};

	useEffect(loadGapiClient, []);

	return (
		<div id="appCapsule">
			<Loading message="Verifying your passcode. Please wait..." showModal={loading} />
			{encryptedWallet && currentAction === 'verify_passcode' ? (
				<div className="login-form" id="cmpUnlock" style={{ marginTop: 80 }}>
					<div className="section">
						<h1>Restore Wallet</h1>
						<h4>Please enter your 6-digit old passcode</h4>
					</div>
					<div className="section mt-2 mb-5">
						<div className="form-group boxed">
							<div className="input-wrapper">
								<input
									onChange={handlePasscodeChange}
									type="text"
									pattern="[0-9]*"
									inputMode="numeric"
									className="form-control verify-input pwd"
									name="passcode"
									placeholder="------"
									maxLength={6}
									value={passcode}
									style={{ color: 'green' }}
								/>
								<div className="text-center">
									{errorMsg && <small className="text-danger message">{errorMsg}</small>}
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center">
					{!encryptedWallet && progressWidth < 10 && 'Initializing google restore...'}
				</div>
			)}

			<div id="cmpMain">
				{currentAction === 'restore_wallet' && (
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
								{progressWidth === 100 && (
									<Link to="/" className="btn btn-primary btn-home mt-3">
										Go to Home
									</Link>
								)}
								{loading && (
									<div className="spinner-border text-success mt-5 in-progress" role="status" />
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
