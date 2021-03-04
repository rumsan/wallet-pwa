import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import Swal from 'sweetalert2';

import ModalWrapper from '../global/ModalWrapper';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS } from '../../constants';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function UnlockedFooter() {
	let history = useHistory();
	const { saveScannedAddress, saveSendingTokenName } = useContext(AppContext);
	const [scanModal, setScanModal] = useState(false);

	const handleScanModalToggle = () => setScanModal(!scanModal);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};
	const handlScanSuccess = data => {
		if (data) {
			try {
				const initials = data.substring(0, 2);
				if (initials === '0x') {
					saveScannedAddress({ address: data });
					handleScanModalToggle();
					history.push('/select-token');
					return;
				}
				let properties = data.split(',');
				let obj = {};
				properties.forEach(function (property) {
					let tup = property.split(':');
					const keyName = tup[0].trim();
					const value = tup[1].trim();
					obj[keyName] = value;
				});
				const tokenName = Object.getOwnPropertyNames(obj)[0];
				obj.address = obj[tokenName];
				saveTokenNameToCtx(tokenName);
				saveScannedAddress(obj);
				handleScanModalToggle();
				history.push('/transfer');
			} catch (err) {
				console.log('ERR:', err);
				handleScanModalToggle();
				Swal.fire('ERROR', 'Invalid wallet address!', 'error');
			}
		}
	};

	const saveTokenNameToCtx = tokenName => {
		if (tokenName === 'ethereum') saveSendingTokenName('ethereum');
		else saveSendingTokenName(tokenName);
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
					<Link to="/tokens" className="item">
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
							<strong>Vault</strong>
						</div>
					</Link>
					<Link to="/settings" className="item">
						<div className="col">
							<ion-icon name="options-outline" />
							<strong>Settings</strong>
						</div>
					</Link>
				</div>
			</div>
		</>
	);
}
