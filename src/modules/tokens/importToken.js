import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';

import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import Contract from '../../utils/blockchain/contract';
import DataService from '../../services/db';
import { AppContext } from '../../contexts/AppContext';
import ModalWrapper from '../global/ModalWrapper';

import { APP_CONSTANTS } from '../../constants';
const { SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function ImportToken() {
	const { address, wallet, network } = useContext(AppContext);
	let history = useHistory();

	const [token, setToken] = useState({});
	const [loading, setLoading] = useState(false);
	const [scanModal, setScanModal] = useState(false);

	const handleScanModalToggle = () => setScanModal(!scanModal);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};

	const handlScanSuccess = data => {
		if (data) {
			handleScanModalToggle();
			fetchTokenDetails(data);
		}
	};

	const fetchTokenDetails = async contractAddress => {
		try {
			setLoading(true);
			if (!wallet) throw Error('Please unlock the wallet first.');
			const tokenContract = Contract({ wallet, address: contractAddress, type: 'erc20' }).get();

			const symbol = await tokenContract.symbol();
			const name = await tokenContract.name();
			const decimal = await tokenContract.decimals();
			const balance = await tokenContract.balanceOf(address);
			setToken({
				address: contractAddress,
				type: 'erc20',
				name,
				symbol,
				decimal,
				balance: balance.toNumber(),
				network
			});

			setLoading(false);
		} catch (err) {
			setLoading(false);
			setToken({ address: '', name: '', symbol: '', type: '', decimal: '', balance: '', network: null });
			Swal.fire('ERROR', err.message, 'error');
		}
	};

	const handleClickAddToken = async () => {
		await DataService.addMultiAssets(token);
		setToken({ address: '', name: '', symbol: '', type: '', decimal: '', balance: '', network: null });
		history.push('/assets');
	};

	const changeInputContractAddress = async e => {
		const { value } = e.target;
		if (value.length > 40) {
			return fetchTokenDetails(value);
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
			<Loading showModal={loading} message="Fetching token details. Please wait.." />
			<AppHeader currentMenu="Import Token" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2 mb-5">
						<div className="card mt-5" id="cmpTransfer">
							<div className="card-body">
								<form>
									<div className="form-group boxed" style={{ padding: 0 }}>
										<div className="input-wrapper">
											<label className="label" htmlFor="contractAddress">
												Token Contract Address:
											</label>
											<div className="input-group mb-3">
												<input
													type="text"
													className="form-control"
													id="contractAddress"
													name="contractAddress"
													placeholder="Enter token contract address"
													value={token.address}
													onChange={changeInputContractAddress}
												/>
												<i className="clear-input">
													<ion-icon
														name="close-circle"
														role="img"
														className="md hydrated"
														aria-label="close circle"
													/>
												</i>
												<div className="ml-1">
													<button
														onClick={handleScanModalToggle}
														type="button"
														className="btn btn-icon btn-primary mr-1 mb-1 btn-scan-address"
													>
														<ion-icon name="qr-code-outline" />
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className="form-group boxed" style={{ padding: 0 }}>
										<div className="row">
											<div className="col-md-6" style={{ marginBottom: 10 }}>
												<div className="input-wrapper">
													<label className="label">Token Name:</label>
													<input
														type="text"
														className="form-control"
														name="symbol"
														value={token.name}
														readOnly
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="input-wrapper">
													<label className="label">Token Symbol:</label>
													<input
														type="text"
														className="form-control"
														name="symbol"
														value={token.symbol}
														readOnly
													/>
												</div>
											</div>
										</div>
									</div>

									<div className="form-group boxed" style={{ marginTop: 12, padding: 0 }}>
										<div className="row">
											<div className="col-md-6" style={{ marginBottom: 10 }}>
												<div className="input-wrapper">
													<label className="label">Decimals of Precision:</label>
													<input
														type="number"
														className="form-control"
														name="decimal"
														value={token.decimal}
														readOnly
													/>
												</div>
											</div>
											<div className="col-md-6">
												<div className="input-wrapper">
													<label className="label">Current Balance:</label>
													<input
														type="number"
														className="form-control"
														name="balance"
														value={token.balance}
														readOnly
													/>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							{token.symbol && (
								<div className="card-footer text-right">
									<button
										type="button"
										id="btnAddToken"
										onClick={handleClickAddToken}
										className="btn btn-success"
									>
										<ion-icon name="send-outline" /> Add Token
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
