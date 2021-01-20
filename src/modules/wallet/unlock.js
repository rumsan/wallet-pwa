import React, { useContext, useState } from 'react';

import { AppContext } from '../../contexts/AppContext';
import Loading from '../global/Loading';
import Wallet from '../../utils/blockchain/wallet';
import { useHistory } from 'react-router-dom';

import { APP_CONSTANTS } from '../../constants';
const { PASSCODE_LENGTH } = APP_CONSTANTS;

export default function Unlock() {
	const { unlockAppScreen, saveAppKeys } = useContext(AppContext);
	let history = useHistory();

	const [pincode, setPincode] = useState('');
	const [loadingModal, setLoadingModal] = useState(false);
	const [unlockError, setUnlockError] = useState(false);

	const handleChangePincode = e => {
		const { value } = e.target;
		setPincode(value);
		if (value.length === PASSCODE_LENGTH) {
			setLoadingModal(true);
			fetchWalletDataAndUnlock(value);
		}
	};

	const fetchWalletDataAndUnlock = async passcode => {
		try {
			const w = new Wallet({ passcode });
			const data = await w.load(passcode);
			setLoadingModal(false);
			unlockAppScreen();
			saveAppKeys(data);
			history.push('/');
		} catch (e) {
			setPincode('');
			setUnlockError(true);
			setLoadingModal(false);
		}
	};

	return (
		<>
			<Loading message="Unlocking your wallet. Please wait..." showModal={loadingModal} />
			<div className="login-form" id="cmpUnlock" style={{ marginTop: 80 }}>
				<div className="section">
					<h1>Wallet Locked</h1>
					<h4>Please enter your 6-digit code to unlock</h4>
				</div>
				<div className="section mt-2 mb-5">
					<div className="form-group boxed">
						<div className="input-wrapper">
							<input
								onChange={handleChangePincode}
								type="password"
								pattern="[0-9]*"
								inputMode="numeric"
								className="form-control verify-input"
								id="unlockCode"
								placeholder="------"
								maxLength={6}
								value={pincode}
								style={{ color: 'green' }}
							/>
							<div className="text-center">
								{unlockError && (
									<small className="text-danger message">
										Passcode did not match. Please enter correct passcode
									</small>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
