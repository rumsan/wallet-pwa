import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AppHeader from '../layouts/AppHeader';
import { getTokenAssets } from '../../utils/sessionManager';
import EtherImg from '../../assets/images/ether.png';

export default function Index() {
	let history = useHistory();

	const [tokenAssets, setTokenAssets] = useState([]);

	useEffect(() => {
		const _tokens = getTokenAssets();
		setTokenAssets(_tokens);
	}, []);

	const handleTokenClick = (e, symbol) => {
		e.preventDefault();
		history.push('/token/' + symbol);
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
											onClick={e => handleTokenClick(e, token.symbol)}
										>
											<img src={EtherImg} alt="Token Icon" className="image" />
											<div className="in">
												<div>{token.tokenName || 'N/A'}</div>
												<span className="text-muted">
													{token.tokenBalance} {token.symbol}
												</span>
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
