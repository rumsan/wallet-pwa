import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import Swal from 'sweetalert2';
import axios from 'axios';

import ModalWrapper from '../global/ModalWrapper';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS } from '../../constants';
import DataService from '../../services/db';

const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function UnlockedFooter() {
	let history = useHistory();
	const { saveScannedAddress, wallet, network } = useContext(AppContext);
	const [scanModal, setScanModal] = useState(false);

	const handleScanModalToggle = () => setScanModal(!scanModal);

	const handleQRLogin = async payload => {
		try {
			const signedData = await wallet.signMessage(payload.token);
			const { data } = await axios.post(payload.callbackUrl, {
				id: payload.id,
				signature: signedData
			});
			if (data) {
				handleScanModalToggle();
				Swal.fire('SUCCESS', 'Logged in successfully!', 'success');
			}
		} catch (err) {
			Swal.fire('ERROR', 'Login using wallet failed!', 'error');
		}
	};

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const isJsonString = str => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

	const handlScanSuccess = async data => {
		let loginPayload = null;
		if (data) {
			const isJsonStr = isJsonString(data);
			if (isJsonStr === true) {
				loginPayload = JSON.parse(data);
				if (loginPayload && loginPayload.action === 'login') return handleQRLogin(loginPayload);
			} else {
				try {
					const initials = data.substring(0, 2);
					if (initials === '0x') {
						saveScannedAddress({ address: data });
						handleScanModalToggle();
						history.push('/select-token');
						return;
					}
					if (data.indexOf(':') === -1) throw Error('This QR Code is not supported by Rumsan Wallet.');

					let properties = data.split(':');
					let symbol = properties[0] === 'ethereum' ? 'ETH' : properties[0];
					let token = await DataService.getAssetBySymbol(symbol, network.name);
					if (!token)
						throw Error(
							`Token with symbol ${symbol} does not exist in your asset library. Please add asset and try again.`
						);
					handleScanModalToggle();
					history.push(`/transfer/${token.address}/${properties[1]}`);
				} catch (err) {
					console.log('ERR:', err);
					handleScanModalToggle();
					Swal.fire('ERROR', err.message, 'error');
				}
			}
		}
	};

	return (
		<>
			<ModalWrapper title="Scan a QR Code" showModal={scanModal} handleModal={handleScanModalToggle}>
				<div style={SCANNER_CAM_STYLE}>
					<QrReader
						delay={SCAN_DELAY}
						style={SCANNER_PREVIEW_STYLE}
						onError={handleScanError}
						onScan={handlScanSuccess}
					/>
				</div>
			</ModalWrapper>
			<div className="footer-unlocked">
				<div className="appBottomMenu">
					<Link to="/" className="item">
						<div className="col">
							<ion-icon name="home-outline" />
							<strong>Home</strong>
						</div>
					</Link>
					<Link to="/assets" className="item">
						<div className="col">
							<ion-icon name="briefcase-outline" />
							<strong>Assets</strong>
						</div>
					</Link>
					<a href="#home" className="item" id="btnScanner" onClick={handleScanModalToggle}>
						<div className="col">
							<div className="action-button large">
								<ion-icon name="qr-code-outline" />
							</div>
						</div>
					</a>
					<Link to="/vault" className="item">
						<div className="col">
							<ion-icon name="document-outline" />
							<strong>DocVault</strong>
						</div>
					</Link>
					<Link to="/profile" className="item">
						<div className="col">
							<ion-icon name="options-outline" />
							<strong>Profile</strong>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
}
