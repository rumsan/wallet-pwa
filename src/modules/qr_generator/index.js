import React, { useEffect, useState, useContext } from 'react';
import { useQRCode } from 'react-qrcodes';
import { ethers } from 'ethers';
import { AppContext } from '../../contexts/AppContext';

import { getCurrentNetwork } from '../../utils/sessionManager';
import { getNetworkByName } from '../../constants/networks';

export default function Index({ publicKey }) {
	const [balance, setBalance] = useState(0);
	const [blockchainNetwork, setBlockchainNetwork] = useState(null);
	const { lockScreen, saveEthBalance } = useContext(AppContext);

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
				saveEthBalance(myBalance);
				setBalance(myBalance);
			})
			.catch(err => {
				console.log('ERR:', err);
				setBalance(0);
			});
	};

	useEffect(fetchMyBalance, []);

	const [inputRef] = useQRCode({
		text: `${publicKey ? 'ethereum:' + publicKey : ''}`,
		options: {
			level: 'M',
			margin: 7,
			scale: 1,
			width: 260
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
				{!lockScreen && (
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
								<h3 className="card-text text-right">
									Balance: <span className="infoBalance">{balance}</span>
								</h3>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
