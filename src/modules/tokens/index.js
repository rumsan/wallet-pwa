import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import EtherImg from '../../assets/images/ether.png';
import Blockchain from '../misc/blockchain';
import Contract from '../../utils/blockchain/contract';
import DataService from '../../services/db';

export default function Index() {
	let history = useHistory();
	const { address, network, wallet } = useContext(AppContext);

	const [tokenAssets, setTokenAssets] = useState([]);
	const [ethBalance, setEthBalance] = useState(0);

	useEffect(() => {
		(async () => {
			let assets = await DataService.listAssets(network.name);
			const defaultAsset = assets.find(a => a.address === 'default');
			assets = assets.filter(a => a.address !== 'default');
			assets.unshift(defaultAsset);
			setTokenAssets(assets);
		})();
	}, [network.name]);

	const getBalances = useCallback(async () => {
		for (let token of tokenAssets) {
			if (token.address === 'default') {
				token.balance = await Blockchain({ network }).getBalance(address);
			} else {
				const contract = Contract({ wallet, address: token.address, type: 'erc20' }).get();
				const tokenBalance = await contract.balanceOf(address);
				token.balance = tokenBalance.toNumber();
			}
			setEthBalance(token.balance);
			DataService.saveAsset(token);
		}
	}, [address, network, tokenAssets, wallet]);

	useEffect(() => {
		getBalances();
		const interval = setInterval(() => {
			getBalances();
		}, 10000);
		return () => clearInterval(interval);
	}, [getBalances]);

	const handleTokenClick = (e, tokenAddress) => {
		e.preventDefault();
		history.push('/assets/' + tokenAddress);
	};

	const handleIconClick = e => {
		e.preventDefault();
		history.push('/import-token');
	};

	return (
		<div id="appCapsule">
			<AppHeader handleIconClick={handleIconClick} iconName="add-outline" currentMenu="Assets" />
			<div className="card-body">
				<div>
					<div className="listview-title mt-2">Your Token Assets</div>

					<ul className="listview image-listview">
						{tokenAssets && tokenAssets.length > 0 ? (
							tokenAssets.map(token => {
								return (
									<li key={token.symbol}>
										<a
											href="#view"
											className="item"
											onClick={e => handleTokenClick(e, token.address)}
										>
											<div className="item">
												<img src={EtherImg} alt="Token" className="image" />
												<div className="in">
													<div>
														{token.name || 'N/A'}
														<footer>{token.symbol}</footer>
													</div>
													<span className="badge badge-primary">
														{token.balance ? Number(token.balance).toFixed(2) : 0}
													</span>
												</div>
											</div>
										</a>
									</li>
								);
							})
						) : (
							<div style={{ padding: 20 }}>
								<span>
									<small test={ethBalance}>Your assets will appear here...</small>
								</span>
							</div>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
