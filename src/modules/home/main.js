import React, { useState, useContext, useEffect } from 'react';

import ModalWrapper from '../global/ModalWrapper';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import QRScanner from '../qr_scanner';
import SetupButton from './setupButton';
import { AppContext } from '../../contexts/AppContext';
import { getPublicKey, savePublickey, getEncryptedWallet } from '../../utils/sessionManager';
import { APP_CONSTANTS } from '../../constants';

const { PASSCODE_LENGTH } = APP_CONSTANTS;
const publicKey = getPublicKey();

export default function Main() {
	const { lockScreen, lockAppScreen, address, saveAppKeys } = useContext(AppContext);

	const [showWallet, setShowWallet] = useState(false);
	const [showModal, setShowModal] = useState({
		passcodeModal: false,
		restoreModal: false
	});
	const [passcode, setPasscode] = useState('');
	const [confirmPasscode, setConfirmPasscode] = useState('');
	const [passCodeMatch, setPasscodeMatch] = useState(true);
	const [loadingModal, setLoadingModal] = useState(false);

	const fetchWallet = () => {
		const existingWallet = getEncryptedWallet();
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
				setShowWallet(true);
			} else setPasscodeMatch(false);
			return;
		}
		setShowWallet(false);
	};

	const resetFormStates = () => {
		setPasscode('');
		setConfirmPasscode('');
		setPasscode(true);
		setLoadingModal(false);
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
			console.log('ERR=>', err);
		}
	};

	const handleSubmit = () => {};

	return (
		<div id="appCapsule">
			<ModalWrapper
				title="Restore your wallet"
				showModal={showModal.restoreModal}
				handleModal={toggleModal}
				handleSubmit={handleSubmit}
			>
				<div className="row">
					<div className="col">
						<p>Please enter your 12 to 24 words mnemonic to restore your wallet.</p>
						<textarea
							type="text"
							style={{ width: '100%', borderColor: 'gray', height: 84 }}
							name="mnemonic"
							defaultValue={''}
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
				{showWallet && (
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
							Restore Existing Wallet
						</button>
					</div>
				)}
			</ModalWrapper>
			<Loading message="Creating your new wallet. Please wait..." showModal={loadingModal} />
			<div id="cmpCreateWallet">
				<div className="header-large-title">
					<h1 className="title">Rumsan Wallet</h1>
					<h4 className="subtitle">Welcome Buddy,</h4>
				</div>
				<div className="section mt-2 mb-5" id="cmpInfo">
					{publicKey ? (
						<div className="card">
							<div className="pl-4 pt-3 pr-4 text-center">
								<QRScanner publicKey={publicKey} />
							</div>
						</div>
					) : (
						<div className="card mt-5">
							<div className="card-header">
								{lockScreen ? (
									<h4 className="text-center">
										<ion-icon name="lock-closed" /> Unlock your screen by tapping on lock icon at
										bottom of screen.
									</h4>
								) : (
									<h4>
										Let's setup your wallet. You can either create a new wallet or restore existing
										wallet. Let's begin.
									</h4>
								)}
							</div>
							{!lockScreen && !publicKey && <SetupButton toggleModal={toggleModal} />}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
