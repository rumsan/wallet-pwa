import React, { useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import AppHeader from '../layouts/AppHeader';
import Loading from '../global/Loading';
import { AppContext } from '../../contexts/AppContext';

import { getTokenAssets } from '../../utils/sessionManager';
import { getAbi, ethersContract } from '../../utils/blockchain/abi';
import { mergeAndRemoveDuplicate } from '../../utils/index';
import EtherImg from '../../assets/images/ether.png';
import { APP_CONSTANTS } from '../../constants';

const { CONTRACT_NAME } = APP_CONSTANTS;

export default function Index() {
	const { address, saveTokens } = useContext(AppContext);
	let history = useHistory();

	const [contractAddress, setContractAddress] = useState('');
	const [tokenSymbol, setTokenSymbol] = useState('');
	const [decimalsPrecision, setDecimalsPrecision] = useState('');
	const [tokenBalance, setTokenBalance] = useState(0);
	const [tokenName, setTokenName] = useState('');
	const [loading, setLoading] = useState(false);
	const [tokenAssets, setTokenAssets] = useState([]);
	const [assetFetched, setAssetFeched] = useState(false);

	const changeInputContractAddress = async e => {
		const { value } = e.target;
		setContractAddress(value);
		if (value.length > 40) {
			return fetchTokenDetails(value);
		}
	};

	const resetFormFields = () => {
		setContractAddress('');
		setTokenSymbol('');
		setDecimalsPrecision('');
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
		let existing = tokenAssets || [];
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
		setAssetFeched(true);
		saveTokens(merged);
		Swal.fire('Success', 'Token added successfully.', 'success');
		resetFormFields();
	};

	useEffect(() => {
		const _tokens = getTokenAssets();
		setTokenAssets(_tokens);
	}, [assetFetched]);

	const handleSendClick = e => {
		e.preventDefault();
		history.push('/transfer');
	};

	return (
		<div id="appCapsule">
			<Loading showModal={loading} message="Fetching token details. Please wait.." />
			<AppHeader currentMenu="Assets" />
			<div className="card-body">
				<div>
					<div className="listview-title mt-2">Your Token Assets</div>
					<ul className="listview image-listview">
						{tokenAssets && tokenAssets.length > 0 ? (
							tokenAssets.map(token => {
								return (
									<li key={token.symbol}>
										<a href="#send" className="item" onClick={e => handleSendClick(e)}>
											<img src={EtherImg} alt="Token Icon" className="image" />
											<div className="in">
												<div>{token.tokenName || 'N/A'}</div>
												<span className="text-muted">
													{token.tokenBalance} {token.symbol}
												</span>
											</div>
										</a>
									</li>
								);
							})
						) : (
							<div style={{ padding: 20 }}>
								<span>
									<small>Your assets will appear here...</small>
								</span>
							</div>
						)}
					</ul>
				</div>
			</div>

			<div id="cmpMain" style={{ display: 'none' }}>
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
	);
}
