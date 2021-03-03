import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../layouts/AppHeader';
import EtherImg from '../../assets/images/ether.png';
import { useHistory } from 'react-router-dom';
import { getTokenAssets, getCurrentNetwork } from '../../utils/sessionManager';
import { DEFAULT_TOKEN } from '../../constants';

import { AppContext } from '../../contexts/AppContext';
const tokens = getTokenAssets();
const ETHER_NETWORK = 'ethereum';

export default function Details(props) {
	const currentNetwork = getCurrentNetwork();
	let history = useHistory();
	const { saveSendingTokenName, ethBalance } = useContext(AppContext);

	const { symbol } = props.match.params;
	const [tokenDetails, setTokenDetails] = useState(null);

	const getTokenDetails = () => {
		if (symbol === DEFAULT_TOKEN.SYMBOL) {
			let token = { tokenName: DEFAULT_TOKEN.NAME, tokenBalance: ethBalance || 0, symbol };
			setTokenDetails(token);
		} else {
			const details = tokens.find(item => item.symbol === symbol);
			if (details) setTokenDetails(details);
		}
	};

	useEffect(getTokenDetails, [symbol]);

	const handleTransferClick = e => {
		e.preventDefault();
		const details = tokens.find(item => item.symbol === symbol);
		if (details) saveSendingTokenName(details.tokenName);
		else saveSendingTokenName(ETHER_NETWORK);
		history.push('/transfer');
	};
	return (
		<>
			<AppHeader currentMenu="Token Details" />
			<div id="appCapsule">
				<div className="section mt-2">
					{/* item */}
					<div className="card cart-item mb-2">
						<div className="card-body">
							<div className="in">
								<img src={EtherImg} alt="product" className="imaged" />
								<div className="text">
									<h3 className="title">{tokenDetails ? tokenDetails.tokenName : 'N/A'}</h3>
									<p className="detail">{tokenDetails && tokenDetails.symbol}</p>
									<strong className="price"> {tokenDetails && tokenDetails.tokenBalance}</strong>
								</div>
							</div>
							<div className="cart-item-footer">
								<div className="stepper  stepper-secondary">
									<span style={{ fontSize: '0.8rem' }}>{currentNetwork.display}</span>
								</div>
								<a
									href="#send"
									onClick={e => handleTransferClick(e)}
									className="btn btn-primary btn-sm"
								>
									<ion-icon name="send-outline"></ion-icon>
									Send
								</a>
							</div>
						</div>
					</div>
					{/* * item */}
				</div>
			</div>
		</>
	);
}
