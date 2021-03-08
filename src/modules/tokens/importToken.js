import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader';

import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';
import { getTokenAssets } from '../../utils/sessionManager';
import { getAbi, ethersContract } from '../../utils/blockchain/abi';
import { mergeAndRemoveDuplicate } from '../../utils/index';
import { AppContext } from '../../contexts/AppContext';
import ModalWrapper from '../global/ModalWrapper';

import { APP_CONSTANTS } from '../../constants';
const { CONTRACT_NAME, SCAN_DELAY, SCANNER_PREVIEW_STYLE, SCANNER_CAM_STYLE } = APP_CONSTANTS;

export default function ImportToken() {
	const { address, saveTokens } = useContext(AppContext);
	let history = useHistory();

	const [contractAddress, setContractAddress] = useState('');
	const [tokenName, setTokenName] = useState('');
	const [tokenBalance, setTokenBalance] = useState(0);
	const [tokenSymbol, setTokenSymbol] = useState('');
	const [decimalsPrecision, setDecimalsPrecision] = useState('');
	const [loading, setLoading] = useState(false);
	const [scanModal, setScanModal] = useState(false);

	const resetFormFields = () => {
		setContractAddress('');
		setTokenSymbol('');
		setDecimalsPrecision('');
	};

	const handleScanModalToggle = () => setScanModal(!scanModal);

	const handleScanError = err => {
		alert('Oops, scanning failed. Please try again');
	};
	const handlScanSuccess = data => {
		if (data) {
			setContractAddress(data);
			handleScanModalToggle();
			fetchTokenDetails(data);
		}
	};

	const fetchTokenDetails = async contractAddress => {
		try {
			setLoading(true);
			let tokenAbi = await getAbi(CONTRACT_NAME);
			let TokenContract = await ethersContract(tokenAbi, contractAddress);
			let name = await TokenContract.name();
			let symbol = await TokenContract.symbol();
			let decimals = await TokenContract.decimals();
			let balance = await TokenContract.balanceOf(address);
			setTokenName(name);
			setTokenBalance(balance.toNumber());
			setTokenSymbol(symbol);
			setDecimalsPrecision(decimals);
			setLoading(false);
		} catch (err) {
			resetFormFields();
			setLoading(false);
			Swal.fire('ERROR', err.message, 'error');
		}
	};

	const handleClickAddToken = () => {
		const _tokens = getTokenAssets();
		let existing = _tokens || [];
		let newData = [];
		const data = {
			tokenName: tokenName,
			contract: contractAddress,
			symbol: tokenSymbol,
			decimal: decimalsPrecision,
			tokenBalance: tokenBalance
		};
		newData.push(data);
		const merged = mergeAndRemoveDuplicate(existing, newData, 'symbol');
		saveTokens(merged);
		resetFormFields();
		history.push('/tokens');
	};

	const changeInputContractAddress = async e => {
		const { value } = e.target;
		setContractAddress(value);
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
													value={contractAddress}
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
										<div className="input-wrapper">
											<label className="label" htmlFor="tokenSymbol">
												Token Symbol:
											</label>
											<input
												type="text"
												className="form-control"
												id="tokenSymbol"
												name="tokenSymbol"
												value={tokenSymbol}
												readOnly
											/>
											<i className="clear-input">
												<ion-icon
													name="close-circle"
													role="img"
													className="md hydrated"
													aria-label="close circle"
												/>
											</i>
										</div>
									</div>

									<div className="form-group boxed" style={{ marginTop: 15, padding: 0 }}>
										<div className="input-wrapper">
											<label className="label" htmlFor="decimalPrecision">
												Decimals of Precision:
											</label>
											<input
												type="number"
												className="form-control"
												id="decimalPrecision"
												name="decimalPrecision"
												value={decimalsPrecision}
												readOnly
											/>
											<i className="clear-input">
												<ion-icon
													name="close-circle"
													role="img"
													className="md hydrated"
													aria-label="close circle"
												/>
											</i>
										</div>
									</div>
								</form>
							</div>
							{contractAddress && tokenSymbol && (
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
