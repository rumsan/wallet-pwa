import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useQRCode } from 'react-qrcodes';
import Blockchain from '../misc/blockchain';
import { AppContext } from '../../contexts/AppContext';
import DataService from '../../services/db';

export default function Index({ address }) {
	const [balance, setBalance] = useState(0);
	const [token, setToken] = useState({});
	const { network, wallet } = useContext(AppContext);

	const fetchMyBalance = useCallback(async () => {
		if (wallet) {
			let balance = await Blockchain({ network }).getBalance(address);
			setBalance(parseFloat(balance).toFixed(2));
			token.balance = balance;
			DataService.saveAsset(token);
		}
	}, [address, network, token, wallet]);

	useEffect(() => {
		(async () => {
			let dtoken = await DataService.getAsset('default');
			setBalance(parseFloat(dtoken.balance).toFixed(2));
			setToken(dtoken);
		})();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			fetchMyBalance();
		}, 10000);
		return () => clearInterval(interval);
	}, [fetchMyBalance]);

	const [inputRef] = useQRCode({
		text: `${address ? 'ethereum:' + address : ''}`,
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
					<h5 className="card-text infoAddress text-bold">{address}</h5>
					<small style={{ fontSize: 10 }}>
						Scan the QR Code or use the address to receive tokens to your account.
					</small>
				</div>
				{wallet && (
					<div className="card-footer">
						<div className="row">
							<div className="col">
								<small>
									<span className="infoNetwork" style={{ fontStyle: 'italic' }}>
										{network && network.display}
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
