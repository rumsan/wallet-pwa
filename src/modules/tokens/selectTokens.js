import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AppHeader from '../layouts/AppHeader';
import { AppContext } from '../../contexts/AppContext';
import EtherImg from '../../assets/images/ether.png';
import DataService from '../../services/db';

export default function SelectTokens() {
	let history = useHistory();
	const { network } = useContext(AppContext);

	const [tokenAssets, setTokenAssets] = useState([]);

	useEffect(() => {
		(async () => {
			let assets = await DataService.listAssets(network.name);
			const defaultAsset = assets.find(a => a.address === 'default');
			assets = assets.filter(a => a.address !== 'default');
			assets.unshift(defaultAsset);
			setTokenAssets(assets);
		})();
	}, [network.name]);

	const handleTokenClick = (e, tokenAddress) => {
		e.preventDefault();
		history.push('/transfer/' + tokenAddress);
	};

	return (
		<div id="appCapsule">
			<AppHeader currentMenu="Select Token" />
			<div className="card-body">
				<div>
					<ul className="listview image-listview">
						{/* <li key={DEFAULT_TOKEN.SYMBOL}>
							<a href="#view" className="item" onClick={e => handleTokenClick(e, DEFAULT_TOKEN.SYMBOL)}>
								<div className="item">
									<img src={EtherImg} alt="Token" className="image" />
									<div className="in">
										<div>
											{DEFAULT_TOKEN.NAME}
											<footer>{DEFAULT_TOKEN.SYMBOL}</footer>
										</div>
										<span className="badge badge-primary">{ethBalance || 0}</span>
									</div>
								</div>
							</a>
						</li> */}
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
													<span className="badge badge-primary">{token.balance || 0}</span>
												</div>
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
		</div>
	);
}
