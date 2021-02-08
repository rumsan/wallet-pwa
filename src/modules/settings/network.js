import React, { useContext, useState, useEffect } from 'react';

import AppHeader from '../layouts/AppHeader';
import { NETWORKS } from '../../constants/networks';
import { AppContext } from '../../contexts/AppContext';
import Wallet from '../../utils/blockchain/wallet';

export default function Network() {
	const { changeCurrentNetwork } = useContext(AppContext);
	const [customNetworkUrl, setCustomNetworkUrl] = useState('');
	const [isCustom, setIsCustom] = useState(false);
	const [currentNetworkName, setCurrentNetworkName] = useState(null);
	const [networkUpdateStatus, setNetworkUpdateStatus] = useState('');

	const handleCustomUrlChange = e => {
		setCustomNetworkUrl(e.target.value);
		setTimeout(() => {
			changeCurrentNetwork('custom', customNetworkUrl);
			networkUpdateSuccess();
		}, 4000);
	};

	const networkUpdateSuccess = () => {
		setNetworkUpdateStatus('success');
	};

	const handleNetworkChange = e => {
		const { value } = e.target;
		setCurrentNetworkName(value);
		if (value === 'custom') {
			setIsCustom(true);
			return;
		}
		setIsCustom(false);
		changeCurrentNetwork(value);
		networkUpdateSuccess();
		setTimeout(() => {
			setNetworkUpdateStatus('');
		}, 1000);
	};

	const fetchCurrentNetwork = () => {
		const w = new Wallet({});
		const current = w.fetchCurrentNetwork();
		const { name, url } = current;
		if (name === 'custom') {
			setCustomNetworkUrl(url);
			setIsCustom(true);
		}
		setCurrentNetworkName(name);
	};

	useEffect(fetchCurrentNetwork, []);

	return (
		<>
			<AppHeader currentMenu="Networks" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section full mt-2">
						<div className="section-title">Select an Network:</div>
						<div className="content-header mb-05">
							Please note: changing network will show current balance of only the active network
						</div>
					</div>
					<div className="section full mb-2" id="cmpNetwork">
						<div className="section-title">Available Networks </div>
						<div className="wide-block p-0">
							<form autoComplete="off">
								<div className="input-list">
									{NETWORKS.length &&
										NETWORKS.map(network => {
											return (
												<div key={network.name} className="custom-control custom-radio">
													<input
														checked={
															currentNetworkName && currentNetworkName === network.name
																? true
																: false
														}
														type="radio"
														id={network.name}
														name="selNetwork"
														onChange={handleNetworkChange}
														value={network.name}
														className="custom-control-input active"
													/>
													<label className="custom-control-label" htmlFor={network.name}>
														{network.display}
													</label>
												</div>
											);
										})}
									<div className="custom-control custom-radio">
										<input
											checked={
												currentNetworkName && currentNetworkName === 'custom' ? true : false
											}
											type="radio"
											id="custom"
											name="selNetwork"
											value="custom"
											onChange={handleNetworkChange}
											className="custom-control-input"
										/>
										<label className="custom-control-label" htmlFor="custom">
											Custom Network
										</label>
									</div>
								</div>
								{isCustom && (
									<div className="form-group boxed" id="cmpNetworkUrl" style={{ display: 's' }}>
										<div className="input-wrapper" style={{ margin: '0px 55px' }}>
											<label className="label" htmlFor="customNetworkUrl">
												Enter Network Url
											</label>
											<input
												type="text"
												className="form-control"
												id="customNetworkUrl"
												name="customNetworkUrl"
												value={customNetworkUrl}
												onChange={handleCustomUrlChange}
												placeholder="Ethereum network gateway url"
												autoComplete="off"
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
								)}
								{networkUpdateStatus === 'success' && (
									<div style={{ padding: 20, color: 'green' }}>Network updated successfully.</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
