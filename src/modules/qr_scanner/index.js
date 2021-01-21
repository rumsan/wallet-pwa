import React, { useEffect, useState, useContext } from 'react';
import { useQRCode } from 'react-qrcodes';
import { ethers } from 'ethers';
import { AppContext } from '../../contexts/AppContext';

import { getCurrentNetwork } from '../../utils/sessionManager';
import { getNetworkByName } from '../../constants/networks';

export default function Index({ publicKey }) {
	const [balance, setBalance] = useState('');
	const [blockchainNetwork, setBlockchainNetwork] = useState(null);
	const { lockScreen } = useContext(AppContext);

	const fetchCurrentNetwork = () => {
		let network = getCurrentNetwork();
		if (!network) network = getNetworkByName();
		return network;
	};

	const fetchMyBalance = () => {
		const network = fetchCurrentNetwork();
		setBlockchainNetwork(network);
		const { url } = network;
		const provider = new ethers.providers.JsonRpcProvider(url);
		provider
			.getBalance(publicKey)
			.then(balance => {
				const myBalance = ethers.utils.formatEther(balance);
				setBalance(myBalance);
			})
			.catch(err => {
				console.log('ERR:', err);
				setBalance(0);
			});
	};

	useEffect(fetchMyBalance, []);

	const [inputRef] = useQRCode({
		text: `${publicKey ? publicKey : 'No address linked.'}`,
		options: {
			level: 'M',
			margin: 7,
			scale: 1,
			width: 300
		}
	});

	return (
		<div>
			<div>
				<div className="pl-4 pt-3 pr-4 text-center">
					<canvas ref={inputRef} />
				</div>
				<div className="card-body text-center" style={{ marginTop: '-25px' }}>
					<h5 className="card-text infoAddress text-bold">{publicKey}</h5>
					<small style={{ fontSize: 10 }}>
						Scan the QR Code or use the address to receive tokens to your account.
					</small>
				</div>
				<div className="card-footer">
					<div className="row">
						<div className="col">
							<small>
								<span className="infoNetwork" style={{ fontStyle: 'italic' }}>
									{blockchainNetwork && blockchainNetwork.display}
								</span>
							</small>
						</div>
						<div className="col">
							{!lockScreen ? (
								<h3 className="card-text text-right">
									Balance: {balance ? balance : 'Fetching...'} <span className="infoBalance" />
								</h3>
							) : (
								<span style={{ fontSize: 12 }}>
									<ion-icon name="lock-open-outline" /> Unlock your screen by tapping at lock icon
									below.
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
