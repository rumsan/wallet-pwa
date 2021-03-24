import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { gapi } from 'gapi-script';
import Wallet from '../../utils/blockchain/wallet';

import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';

import { BACKUP } from '../../constants';
import { GFile, GFolder } from '../../utils/google';
import Loading from '../global/Loading';

//const { PASSCODE_LENGTH } = APP_CONSTANTS;

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const GOOGLE_REDIRECT_URL = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function GoogleRestore() {
	const history = useHistory();
	let currentWallet = null;

	const Actions = [
		{
			hash: '#choose-account',
			label: 'Please choose Google account. Please click the switch account button to change account.'
		},
		{
			hash: '#choose-wallet',
			label: 'Please select the wallet you wish to restore.'
		},
		{
			hash: '#enter-passphrase',
			label: 'Please enter backup passphrase.'
		}
	];

	const { setWallet } = useContext(AppContext);
	const [loading, setLoading] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [gUser, setGUser] = useState({
		id: null,
		name: 'Loading User...',
		email: null,
		image: 'http://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png'
	});
	const [passphrase, setPassphrase] = useState('');
	const [walletList, setWalletList] = useState([]);
	const [selectedWallet, setSelectedWallet] = useState({});

	const [currentAction, setCurrentAction] = useState({});

	const changeAction = hash => {
		setErrorMsg(null);
		let selectedAction = Actions.find(a => a.hash === hash);
		if (!selectedAction) setCurrentAction(Actions.find(a => a.hash === '#choose-account'));
		else setCurrentAction(selectedAction);
	};

	const loadGapiClient = () => {
		history.listen(location => {
			changeAction(location.hash);
		});
		changeAction(history.location.hash);
		gapi.load('client:auth2', initClient);
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

	const updateSigninStatus = isSignedIn => {
		let user = null;
		if (isSignedIn) {
			user = gapi.auth2.getAuthInstance().currentUser.get();
			const profile = user.getBasicProfile();
			setGUser({
				id: profile.getId(),
				name: profile.getName(),
				email: profile.getEmail(),
				image: profile.getImageUrl()
			});
		} else user = handleUserSignIn();
	};

	const handleUserSignIn = () => {
		return gapi.auth2.getAuthInstance().signIn();
	};

	const fetchWalletList = async () => {
		history.push('#choose-wallet');
		setLoading('Querying Google Drive for wallet backups. Please wait...');
		const gFolder = new GFolder(gapi);
		const gFile = new GFile(gapi);
		const folder = await gFolder.ensureExists(BACKUP.GDRIVE_FOLDERNAME);
		let files = await gFile.listFiles(folder.id);
		setWalletList(files);
		setLoading(null);
	};

	const fetchSelectedWalletData = async () => {
		setErrorMsg(null);
		setLoading('Fetching wallet data. Please wait...');
		try {
			const gFile = new GFile(gapi);
			let walletData = await gFile.downloadFile(selectedWallet.id);
			currentWallet = JSON.parse(walletData);
			if (!currentWallet.name) throw Error('Not a valid wallet. Please select another wallet.');
			setSelectedWallet(Object.assign(selectedWallet, { data: currentWallet }));
			history.push('#enter-passphrase');
		} catch (e) {
			setErrorMsg(
				e.message === 'Not a valid wallet. Please select another wallet.'
					? e.message
					: 'Issue fetching wallet. Are you sure you selected a right wallet? Please check and try again.'
			);
			setSelectedWallet({});
		}
		setLoading(null);
	};

	const restoreWallet = async () => {
		setErrorMsg(null);
		setLoading('Unlocking and restoring wallet.');
		try {
			DataService.saveWallet(JSON.stringify(selectedWallet.data.wallet));
			const wallet = await Wallet.loadFromJson(passphrase, JSON.stringify(selectedWallet.data.wallet));
			await DataService.saveAddress(wallet.address);
			if (selectedWallet.data.documents) await DataService.saveDocuments(selectedWallet.data.documents);
			if (selectedWallet.data.assets) await DataService.addMultiAssets(selectedWallet.data.assets);
			setWallet(wallet);
			history.push('/');
		} catch (e) {
			console.log(e);
			setPassphrase('');
			setErrorMsg('Backup passphrase is incorrect. Please try again.');
		}
		setLoading(null);
	};

	const showInfo = msg => {
		if (loading) return <div className="text-center p3">Loading...</div>;
		return (
			<div className="text-center p-3">
				{/* {isLoading && (
					<span className="spinner-border spinner-border-sm mr-05" role="status" aria-hidden="true"></span>
				)} */}
				{msg}
			</div>
		);
	};

	const handleBackButton = e => {
		if (history.action === 'POP') return history.push('/google/restore');
		history.goBack();
	};

	useEffect(loadGapiClient, []);

	return (
		<div id="appCapsule">
			<Loading message={loading} showModal={loading} />
			<div className="appHeader bg-success text-light">
				<div className="left">
					{history.location.hash !== '' && (
						<button href="#" className="headerButton btn" onClick={e => handleBackButton()}>
							<ion-icon
								name="chevron-back-outline"
								role="img"
								className="md hydrated"
								aria-label="chevron back outline"
							></ion-icon>
						</button>
					)}
				</div>
				<div className="pageTitle">Wallet Setup</div>
				<div className="right">
					<Link to="/" className="headerButton">
						<ion-icon
							name="home-outline"
							role="img"
							className="md hydrated"
							aria-label="home button"
						></ion-icon>
					</Link>
				</div>
			</div>

			<div style={{ marginTop: 80 }}>
				<div className="section">
					<h2>Restore Wallet from Google Drive</h2>
					<h4>{currentAction.label}</h4>
				</div>

				{currentAction.hash === '#choose-account' && (
					<div className="text-center section full mt-2 mb-3">
						<div className="text-center wide-block p-3">
							<div className="avatar">
								<img src={gUser.image} alt="avatar" className="imaged w64 rounded" />
							</div>
							<div className="in mt-1">
								<h3 className="name">{gUser.name}</h3>
								<h5 className="subtext" style={{ margin: -3 }}>
									{gUser.email}
								</h5>
							</div>
							{gUser.id && (
								<button
									className="btn btn-sm btn-outline-secondary mt-2"
									id="btnMnemonic"
									onClick={e => handleUserSignIn()}
								>
									Switch account
								</button>
							)}
						</div>
						{gUser.id && (
							<div className="text-center mt-3">
								<button
									className="btn btn-primary"
									id="btnMnemonic"
									onClick={e => fetchWalletList()}
									disabled={loading ? 'true' : ''}
								>
									Continue wallet restore for selected user
								</button>
							</div>
						)}
					</div>
				)}

				{currentAction.hash === '#choose-wallet' && (
					<div className="section full mt-2 mb-3">
						<div className="wide-block p-0">
							<div className="input-list">
								{walletList.length
									? walletList.map(d => {
											return (
												<div key={d.id} className="custom-control custom-radio">
													<input
														type="radio"
														id={d.id}
														name="walletList"
														className="custom-control-input"
														value={d.id}
														checked={selectedWallet.id === d.id}
														onChange={e => {
															setErrorMsg(null);
															setSelectedWallet(d);
														}}
													/>
													<label className="custom-control-label" htmlFor={d.id}>
														{d.name}
													</label>
												</div>
											);
									  })
									: showInfo('There are no wallet backed up in your Google Drive.')}
							</div>
						</div>

						<div className="text-center mt-3">
							{selectedWallet.id && (
								<button
									className="btn btn-primary"
									id="btnMnemonic"
									onClick={e => fetchSelectedWalletData()}
									disabled={loading ? 'true' : ''}
								>
									Continue with selected wallet
								</button>
							)}
						</div>
					</div>
				)}

				{currentAction.hash === '#enter-passphrase' && (
					<div className="section full mt-2 mb-3">
						{!selectedWallet.id && <Redirect to="/google/restore#choose-account" />}
						<div className="wide-block p-2">
							<div className="section full">
								<div className="form-group boxed">
									<div className="input-wrapper">
										<input
											type="text"
											value={passphrase}
											onChange={e => setPassphrase(e.target.value)}
											className="form-control pwd"
											placeholder="Backup Passpharse"
										/>
										<i className="clear-input">
											<ion-icon
												name="close-circle"
												role="img"
												className="md hydrated"
												aria-label="close circle"
											></ion-icon>
										</i>
									</div>
								</div>
							</div>
						</div>

						<div className="text-center mt-3">
							{passphrase.length > 1 && (
								<button
									className="btn btn-primary"
									id="btnMnemonic"
									onClick={e => restoreWallet()}
									disabled={loading ? 'true' : ''}
								>
									Unlock and restore wallet
								</button>
							)}
						</div>
					</div>
				)}
			</div>

			{errorMsg && (
				<div className="text-center">
					<span className="text-danger">
						<b>Error</b>: {errorMsg}
					</span>
				</div>
			)}
		</div>
	);
}
