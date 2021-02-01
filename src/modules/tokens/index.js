import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';

import AppHeader from '../layouts/AppHeader';
import Loading from '../global/Loading';
import { AppContext } from '../../contexts/AppContext';

import { getAbi, ethersContract } from '../../utils/blockchain/abi';
import { mergeAndRemoveDuplicate } from '../../utils/index';
import { APP_CONSTANTS } from '../../constants';

const { CONTRACT_NAME } = APP_CONSTANTS;

export default function Index() {
	const { address, saveTokens, tokenAssets } = useContext(AppContext);

	const [contractAddress, setContractAddress] = useState('');
	const [tokenSymbol, setTokenSymbol] = useState('');
	const [decimalsPrecision, setDecimalsPrecision] = useState('');
	const [tokenBalance, setTokenBalance] = useState(0);
	const [loading, setLoading] = useState(false);

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
			let symbol = await TokenContract.symbol();
			let decimals = await TokenContract.decimals();
			let balance = await TokenContract.balanceOf(address);
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
			contract: contractAddress,
			symbol: tokenSymbol,
			decimal: decimalsPrecision,
			tokenBalance: tokenBalance
		};
		newData.push(data);
		const merged = mergeAndRemoveDuplicate(existing, newData, 'symbol');
		saveTokens(merged);
		Swal.fire('Success', 'Token added successfully.', 'success');
		resetFormFields();
	};

	return (
		<div id="appCapsule">
			<Loading showModal={loading} message="Fetching token details. Please wait.." />
			<AppHeader currentMenu="Assets" />
			<div className="section full mt-2">
				<div className="section-title">Your Assets:</div>
				<div className="content-header mb-05">You can import your assets using token contract address.</div>
			</div>
			<div className="card-body">
				<ul className="list-group">
					{tokenAssets.length > 0 ? (
						tokenAssets.map(token => {
							return (
								<li key={token.symbol} className="list-group-item">
									<ion-icon name="card-outline" />
									&nbsp;{' '}
									<span style={{ verticalAlign: 'text-bottom' }}>
										{token.tokenBalance} {token.symbol}
									</span>
								</li>
							);
						})
					) : (
						<div>
							<ion-icon name="information-circle-outline"></ion-icon>{' '}
							<span style={{ verticalAlign: 'text-bottom' }}>
								<small>Your assets will appear here.</small>
							</span>
						</div>
					)}
				</ul>
			</div>
			<hr />
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
						{contractAddress && tokenSymbol && decimalsPrecision <= 0 && (
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
