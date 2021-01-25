import React, { useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import ModalWrapper from '../global/ModalWrapper';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import QRScanner from '../qr_scanner';
import SetupButton from './setupButton';
import { AppContext } from '../../contexts/AppContext';
import { getPublicKey, savePublickey, getEncryptedWallet } from '../../utils/sessionManager';
import { APP_CONSTANTS } from '../../constants';

const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function Main() {
	const { lockScreen, address, lockAppScreen, saveAppKeys } = useContext(AppContext);
	let history = useHistory();

	const [showWalletActions, setShowWalletActions] = useState(false);
	const [showModal, setShowModal] = useState({
		passcodeModal: false,
		restoreModal: false
	});
	const [passcode, setPasscode] = useState('');
	const [confirmPasscode, setConfirmPasscode] = useState('');
	const [passCodeMatch, setPasscodeMatch] = useState(true);
	const [loadingModal, setLoadingModal] = useState(false);
	const [currentPublicKey, setCurrentPublicKey] = useState('');
	const [mnemonic, setMnemonic] = useState('');
	const [loadingMessage, setLoadingMessage] = useState('Creating your new wallet. Please wait...');

	const fetchWallet = () => {
		const existingWallet = getEncryptedWallet();
		const publicKey = getPublicKey(); // Check from localstorage
		setCurrentPublicKey(publicKey);
		if (existingWallet && !address) {
			lockAppScreen();
		}
	};

	useEffect(fetchWallet, []);

	const toggleModal = modalName => {
		if (!modalName) {
			setShowModal({ passcodeModal: false, restoreModal: false });
			return;
		}
		if (modalName === 'passcodeModal') {
			setShowModal({ passcodeModal: true, restoreModal: false });
		} else if (modalName === 'restoreModal') {
			setShowModal({ passcodeModal: false, restoreModal: true });
			setLoadingMessage('Restoring your wallet. Please wait...');
		}
	};

	const handlePasscodeChange = e => {
		setPasscode(e.target.value);
	};

	const handleConfirmPasscodeChange = e => {
		const { value } = e.target;
		setConfirmPasscode(value);
		if (value.length === PASSCODE_LENGTH) {
			if (value === passcode) {
				setShowWalletActions(true);
			} else setPasscodeMatch(false);
			return;
		}
		setShowWalletActions(false);
	};

	const resetFormStates = () => {
		setPasscode('');
		setConfirmPasscode('');
		setPasscode(true);
		setLoadingModal(false);
		setMnemonic('');
	};

	const handleWalletCreate = async () => {
		try {
			toggleModal();
			setLoadingModal(true);
			const w = new Wallet({ passcode });
			const res = await w.create();
			if (res) {
				const { privateKey, address } = res;
				savePublickey(address);
				saveAppKeys({ privateKey, address });
				resetFormStates();
				toggleModal();
			}
		} catch (err) {
			Swal.fire('ERROR', err.error.message, 'error');
			setLoadingModal(false);
		}
	};

	const handleMnemonicSubmit = async () => {
		if (!mnemonic) return Swal.fire('ERROR', 'Please enter 12 word mnemonic', 'error');
		try {
			toggleModal();
			setLoadingModal(true);
			const w = new Wallet({ passcode });
			const res = await w.create(mnemonic);
			if (res) {
				const { privateKey, address } = res;
				savePublickey(address);
				saveAppKeys({ privateKey, address });
				resetFormStates();
				toggleModal();
			}
		} catch (err) {
			setLoadingModal(false);
			Swal.fire('ERROR', err.message, 'error');
		}
	};

	const handleMnemonicChange = e => setMnemonic(e.target.value);

	const handleGoogleRestoreClick = e => {
		e.preventDefault();
		history.push('/google/restore');
	};

	return (
		<div id="appCapsule">
			<ModalWrapper
				title="Restore your wallet"
				showModal={showModal.restoreModal}
				handleModal={toggleModal}
				handleSubmit={handleMnemonicSubmit}
				showFooter={true}
				btnText="Restore Wallet"
			>
				<div className="row">
					<div className="col">
						<p>Please enter your 12 to 24 words mnemonic to restore your wallet.</p>
						<textarea
							type="text"
							style={{ width: '100%', borderColor: 'gray', height: 84 }}
							name="mnemonic"
							value={mnemonic}
							onChange={handleMnemonicChange}
							required
						/>
					</div>
				</div>
			</ModalWrapper>
			<ModalWrapper
				title="First, let's setup your passcode"
				showModal={showModal.passcodeModal}
				handleModal={toggleModal}
			>
				<div className="row mb-5">
					<div className="col">
						<p>Choose a {PASSCODE_LENGTH}-digit passcode.</p>
						{passcode.length < PASSCODE_LENGTH && (
							<input
								onChange={handlePasscodeChange}
								type="password"
								pattern="[0-9]*"
								inputMode="numeric"
								className="form-control verify-input passcode"
								placeholder="------"
								maxLength={PASSCODE_LENGTH}
								autoComplete="false"
								value={passcode}
							/>
						)}

						{passcode && passcode.length === PASSCODE_LENGTH && (
							<>
								<input
									onChange={handleConfirmPasscodeChange}
									type="password"
									pattern="[0-9]*"
									inputMode="numeric"
									className="form-control verify-input passcode"
									placeholder="------"
									maxLength={PASSCODE_LENGTH}
									autoComplete="false"
									value={confirmPasscode}
								/>
								<div className="text-center">
									{passCodeMatch === true ? (
										<small className="message">Please enter passcode again</small>
									) : (
										<small className="text-danger message">
											Please type correct confirm passcode
										</small>
									)}
								</div>
							</>
						)}
					</div>
				</div>
				{showWalletActions && (
					<div>
						<button
							onClick={handleWalletCreate}
							id="btnNewWallet"
							type="button"
							className="btn btn-block btn-linkedin mb-2"
						>
							<ion-icon
								name="add-circle-outline"
								className="md hydrated"
								aria-label="Create New Wallet"
							/>
							Create New Wallet
						</button>
						<hr />
						<button
							onClick={() => toggleModal('restoreModal')}
							id="btnRestoreWallet"
							type="button"
							className="btn btn-block btn-bitcoin"
						>
							<ion-icon
								name="wallet-outline"
								className="md hydrated"
								aria-label="Restore Existing Wallet"
							/>
							Restore Using Mnemonic
						</button>
						<button
							onClick={handleGoogleRestoreClick}
							id="btnRestoreUsingGoogle"
							type="button"
							className="btn btn-block btn-success"
						>
							<ion-icon name="logo-google" className="md hydrated" aria-label="Restore Using Google" />
							Restore Using Google
						</button>
					</div>
				)}
			</ModalWrapper>
			<Loading message={loadingMessage} showModal={loadingModal} />
			<div id="cmpCreateWallet">
				<div className="header-large-title">
					<h1 className="title">Rumsan Wallet</h1>
					<h4 className="subtitle">Welcome Buddy,</h4>
				</div>
				<div className="section mt-2 mb-5" id="cmpInfo">
					{/* address triggers wallet created in real time */}
					{currentPublicKey || address ? (
						<div className="card">
							<div className="pl-4 pt-3 pr-4 text-center">
								<QRScanner publicKey={currentPublicKey || address} />
							</div>
						</div>
					) : (
						<div className="card mt-5">
							<div className="card-header">
								{!lockScreen && (
									<h4>
										Let's setup your wallet. You can either create a new wallet or restore existing
										wallet. Let's begin.
									</h4>
								)}
							</div>
							{!lockScreen && !currentPublicKey && <SetupButton toggleModal={toggleModal} />}
						</div>
					)}
				</div>
				<div className="text-center">{lockScreen && <strong>Tap on lock icon to unlock</strong>}</div>
			</div>
		</div>
	);
}
