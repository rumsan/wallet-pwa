import React, { useState } from 'react';
import Swal from 'sweetalert2';

import AppHeader from '../layouts/AppHeader';
import { getAbi, ethersContract } from '../../utils/blockchain/abi';
import Loading from '../global/Loading';

const CONTRACT_NAME = 'rumsan';

export default function Index() {
	const [contractAddress, setContractAddress] = useState('');
	const [tokenSymbol, setTokenSymbol] = useState('');
	const [decimalsPrecision, setDecimalsPrecision] = useState('');
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
			//	let tokenBalance = await TokenContract.balanceOf(ACCOUNT_ADDRESS);
			let symbol = await TokenContract.symbol();
			let decimals = await TokenContract.decimals();
			setTokenSymbol(symbol);
			setDecimalsPrecision(decimals);
			setLoading(false);
		} catch (err) {
			resetFormFields();
			setLoading(false);
			Swal.fire('ERROR', err.message, 'error');
		}
	};

	return (
		<div id="appCapsule">
			<Loading showModal={loading} message="Fetching token details. Please wait.." />
			<AppHeader currentMenu="Assets" />
			<div className="section full mt-2">
				<div className="section-title">Your Assests:</div>
				<div className="content-header mb-05">You can import your assets using token contract address.</div>
			</div>
			<div className="card-body">
				<ul className="list-group">
					<li className="list-group-item">
						<ion-icon name="card-outline" />
						&nbsp; <span style={{ verticalAlign: 'text-bottom' }}>100 ETH</span>
					</li>
					<li className="list-group-item">
						<ion-icon name="card-outline" />
						&nbsp; <span style={{ verticalAlign: 'text-bottom' }}>500 LTC</span>
					</li>
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
						{contractAddress && tokenSymbol && decimalsPrecision && (
							<div className="card-footer text-right">
								<button type="button" id="btnAddToken" className="btn btn-success">
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
