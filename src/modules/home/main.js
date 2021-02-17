import React, { useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import ModalWrapper from '../global/ModalWrapper';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import QR_GENERATE from '../qr_generator';
import SetupButton from './setupButton';
import { AppContext } from '../../contexts/AppContext';
import { getPublicKey, getEncryptedWallet } from '../../utils/sessionManager';
import { APP_CONSTANTS } from '../../constants';

const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function Main() {
	const { saveAppPasscode, lockScreen, address, lockAppScreen, saveAppWallet } = useContext(AppContext);
	let history = useHistory();

	const [showWalletActions, setShowWalletActions] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [passcode, setPasscode] = useState('');
	const [confirmPasscode, setConfirmPasscode] = useState('');
	const [passCodeMatch, setPasscodeMatch] = useState(true);
	const [loadingModal, setLoadingModal] = useState(false);
	const [currentPublicKey, setCurrentPublicKey] = useState('');
	const [loadingMessage, setLoadingMessage] = useState('Creating your new wallet. Please wait...');
	const [currentAction, setCurrentAction] = useState('setup_wallet');

	const fetchWallet = () => {
		const existingWallet = getEncryptedWallet();
		const publicKey = getPublicKey(); // Check from localstorage
		if (publicKey) setCurrentPublicKey(publicKey);
		if (existingWallet && !address) {
			lockAppScreen();
		}
	};

	useEffect(fetchWallet, []);

	const resetPasscodes = () => {
		setPasscode('');
		setConfirmPasscode('');
	};

	const togglePasscodeModal = modalName => {
		resetPasscodes();
		if (!modalName) {
			setShowModal(false);
			return;
		}
		setShowModal(!showModal);
		if (modalName === 'restoreModal') {
			setCurrentAction('restore_wallet');
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
			if (value !== passcode) {
				setPasscodeMatch(false);
				return;
			}
			if (currentAction === 'restore_wallet') {
				saveAppPasscode(value);
				history.push('/mnemonic/restore');
			}
			if (currentAction === 'setup_wallet') setShowWalletActions(true);
			return;
		}
		setShowWalletActions(false);
	};

	const handleWalletCreate = async () => {
		try {
			togglePasscodeModal();
			setLoadingModal(true);
			const w = new Wallet({ passcode });
			const res = await w.create();
			if (res) {
				const { privateKey, address, wallet, encryptedWallet } = res;
				const phrases = await wallet.mnemonic.phrase.split(' ');
				const payload = { privateKey, address, wallet, phrases, encryptedWallet };
				saveAppWallet(payload);
				history.push('/create');
			}
		} catch (err) {
			Swal.fire('ERROR', err.error.message, 'error');
			setLoadingModal(false);
		}
	};

	const handleGoogleRestoreClick = e => {
		e.preventDefault();
		history.push('/google/restore');
	};

	return (
		<div id="appCapsule">
			<ModalWrapper
				title="First, let's setup your passcode"
				showModal={showModal}
				handleModal={togglePasscodeModal}
			>
				<div className="row mb-5">
					<div className="col">
						<p>Choose a {PASSCODE_LENGTH}-digit passcode.</p>
						{passcode.length < PASSCODE_LENGTH && (
							<input
								onChange={handlePasscodeChange}
								type="text"
								pattern="[0-9]*"
								inputMode="numeric"
								className="form-control verify-input passcode pwd"
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
				{showWalletActions && currentAction === 'setup_wallet' && (
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
					{currentPublicKey ? (
						<div className="card">
							<div className="pl-4 pt-3 pr-4 text-center">
								<QR_GENERATE publicKey={currentPublicKey || address} />
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
							{!lockScreen && !currentPublicKey && (
								<SetupButton
									handleGoogleRestoreClick={handleGoogleRestoreClick}
									togglePasscodeModal={togglePasscodeModal}
								/>
							)}
						</div>
					)}
				</div>
				<div className="text-center">{lockScreen && <strong>Tap on lock icon to unlock</strong>}</div>
			</div>
		</div>
	);
}
