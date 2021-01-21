import React, { useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import { AppContext } from '../../contexts/AppContext';
import Wallet from '../../utils/blockchain/wallet';
import Loading from '../global/Loading';
import AppHeader from '../layouts/AppHeader';

export default function Index() {
	const { privateKey, scannedEthAddress } = useContext(AppContext);
	let history = useHistory();

	const [sendAmount, setSendAmount] = useState('');
	const [sendToAddress, setSendToAddress] = useState('');
	const [loadingModal, setLoadingModal] = useState(false);

	const handleSendToChange = e => {
		setSendToAddress(e.target.value);
	};

	const handleSendAmtChange = e => {
		setSendAmount(e.target.value);
	};

	const resetFormStates = () => {
		setLoadingModal(false);
		setSendAmount('');
		setSendAmount('');
	};

	const sendSuccess = (data, receipt) => {
		resetFormStates();
		Swal.fire({
			title: 'Success',
			html: `You sent <b>${data.sendAmount}</b> ethers to <b>${data.sendToAddress}</b>.<br>
      Your confirmation code is <b>${receipt.hash}</b>.<br>So far your account has completed ${
				receipt.nonce + 1
			} transactions.`,
			icon: 'success',
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Okay'
		}).then(result => {
			if (result.value) {
				history.push('/');
			}
		});
	};

	const confirmAndSend = async data => {
		const isConfirm = await Swal.fire({
			title: 'Are you sure?',
			html: `You are sending <b>${data.sendAmount}</b> ethers to <b>${data.sendToAddress}</b>.<br>Please double check the address and the amount.`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No'
		});
		if (isConfirm.value) {
			send(data);
		}
	};

	const send = async data => {
		try {
			if (!ethers.utils.isAddress(data.sendToAddress)) throw Error('Destination address is invalid');
			setLoadingModal(true);
			setTimeout(async () => {
				try {
					const w = new Wallet({});
					const wallet = await w.loadFromPrivateKey(privateKey);
					const receipt = await wallet.sendTransaction({
						to: data.sendToAddress,
						value: ethers.utils.parseEther(data.sendAmount.toString())
					});
					sendSuccess(data, receipt);
				} catch (e) {
					Swal.fire('ERROR', e.error.message, 'error');
				} finally {
					setLoadingModal(false);
				}
			}, 250);
		} catch (e) {
			Swal.fire('ERROR', e.message, 'error');
		}
	};

	const handleSendClick = () => {
		if (!sendAmount || !sendToAddress) {
			return Swal.fire({ title: 'ERROR', icon: 'error', text: 'Send amount and receiver address is required' });
		}
		confirmAndSend({ sendAmount, sendToAddress });
	};

	useEffect(() => {
		if (!privateKey) {
			history.push('/');
		}
		scannedEthAddress && setSendToAddress(scannedEthAddress);
	}, [history, privateKey, scannedEthAddress]);

	return (
		<>
			<Loading showModal={loadingModal} message="Transferring tokens. Please wait..." />
			<AppHeader currentMenu="Transfer" />

			<div id="cmpMain">
				<div className="section mt-2 mb-5">
					<div className="card mt-5" id="cmpTransfer">
						<div className="card-body">
							<form>
								<div className="form-group boxed" style={{ padding: 0 }}>
									<div className="input-wrapper">
										<label className="label" htmlFor="sendToAddr">
											Destination Address:
										</label>
										<div className="input-group mb-3">
											<input
												type="text"
												className="form-control"
												id="sendToAddr"
												name="sendToAddr"
												placeholder="Enter receiver's address"
												onChange={handleSendToChange}
												value={sendToAddress}
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
										<label className="label" htmlFor="sendAmount">
											Amount to Send:
										</label>
										<input
											onChange={handleSendAmtChange}
											value={sendAmount}
											type="number"
											className="form-control"
											id="sendAmount"
											name="sendAmount"
											placeholder="Enter amount to send"
											defaultValue
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
								<div className="mt-3">
									<small>
										Important: Please double check the address and amount before sending.
										Transactions cannot be reversed.
									</small>
								</div>
							</form>
						</div>
						<div className="card-footer text-right">
							<button type="button" id="btnSend" className="btn btn-success" onClick={handleSendClick}>
								<ion-icon name="send-outline" /> Send Now
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
