import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AppHeader from '../layouts/AppHeader';
import { getTokenAssets } from '../../utils/sessionManager';
import { AppContext } from '../../contexts/AppContext';
import EtherImg from '../../assets/images/ether.png';
import { DEFAULT_TOKEN } from '../../constants';

export default function SelectTokens() {
	let history = useHistory();
	const { ethBalance, saveSendingTokenName } = useContext(AppContext);

	const [tokenAssets, setTokenAssets] = useState([]);

	useEffect(() => {
		const _tokens = getTokenAssets();
		setTokenAssets(_tokens);
	}, []);

	const handleTokenClick = (e, symbol) => {
		e.preventDefault();
		const _tokens = getTokenAssets();
		const details = _tokens.find(item => item.symbol === symbol);
		if (details) saveSendingTokenName(details.tokenName);
		else saveSendingTokenName(DEFAULT_TOKEN.NETWORK);
		history.push('/transfer');
	};

	return (
		<div id="appCapsule">
			<AppHeader currentMenu="Select Token" />
			<div className="card-body">
				<div>
					<ul className="listview image-listview">
						<li key={DEFAULT_TOKEN.SYMBOL}>
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
						</li>
						{tokenAssets && tokenAssets.length > 0 ? (
							tokenAssets.map(token => {
								return (
									<li key={token.symbol}>
										<a
											href="#view"
											className="item"
											onClick={e => handleTokenClick(e, token.symbol)}
										>
											<div className="item">
												<img src={EtherImg} alt="Token" className="image" />
												<div className="in">
													<div>
														{token.tokenName || 'N/A'}
														<footer>{token.symbol}</footer>
													</div>
													<span className="badge badge-primary">
														{token.tokenBalance || 0}
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
