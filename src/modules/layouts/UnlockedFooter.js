import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';
import ModalWrapper from '../global/ModalWrapper';
import { AppContext } from '../../contexts/AppContext';
import { APP_CONSTANTS } from '../../constants';
import Swal from 'sweetalert2';

const previewStyle = {
	height: 300,
	width: 400,
	display: 'flex',
	justifyContent: 'center'
};
const camStyle = {
	display: 'flex',
	justifyContent: 'center',
	marginTop: '-50px',
	padding: '50px',
	marginBottom: '25px'
};
const { SCAN_DELAY } = APP_CONSTANTS;

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
			//	let eth = data.includes('ethereum');
			//	if (!eth) data = 'ethereum:' + data;
			try {
				let properties = data.split(',');
				let obj = {};
				properties.forEach(function (property) {
					let tup = property.split(':');
					obj[tup[0]] = tup[1].trim();
				});
				const tokenName = Object.getOwnPropertyNames(obj)[0];
				obj.address = obj[tokenName];
				saveTokenSymbolToCtx(tokenName);
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

	const saveTokenSymbolToCtx = tokenName => {
		if (tokenName === 'ethereum') saveSendingTokenName('ethereum');
		else saveSendingTokenName(tokenName);
	};

	return (
		<>
			<ModalWrapper title="Scan a QR Code" showModal={scanModal} handleModal={handleScanModalToggle}>
				<div style={camStyle}>
					<QrReader
						delay={SCAN_DELAY}
						style={previewStyle}
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
