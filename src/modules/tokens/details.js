import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../layouts/AppHeader';
import EtherImg from '../../assets/images/ether.png';
import { useHistory } from 'react-router-dom';
import { getTokenAssets } from '../../utils/sessionManager';

import { AppContext } from '../../contexts/AppContext';
const tokens = getTokenAssets();

export default function Details(props) {
	let history = useHistory();
	const { saveSendingTokenName } = useContext(AppContext);

	const { symbol } = props.match.params;
	const [tokenDetails, setTokenDetails] = useState(null);

	const getTokenDetails = () => {
		const details = tokens.find(item => item.symbol === symbol);
		if (details) setTokenDetails(details);
	};

	useEffect(getTokenDetails, [symbol]);

	const handleTransferClick = () => {
		const details = tokens.find(item => item.symbol === symbol);
		if (details) saveSendingTokenName(details.tokenName);
		history.push('/transfer');
	};
	return (
		<>
			<AppHeader currentMenu="Token Details" />
			<div id="appCapsule">
				<div className="card-body">
					<div>
						<ul className="listview image-listview">
							<li>
								<div className="item">
									<img src={EtherImg} alt="Token" className="image" />
									<div className="in">
										<div>
											{tokenDetails && tokenDetails.tokenName ? tokenDetails.tokenName : 'N/A'}
											<footer>{tokenDetails && tokenDetails.symbol}</footer>
										</div>
										<span className="badge badge-primary">
											{tokenDetails ? tokenDetails.tokenBalance : 0}
										</span>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div style={{ marginTop: 20 }}>
						<button onClick={handleTransferClick} type="button" className="btn btn-primary btn-block">
							<ion-icon name="send-outline"></ion-icon>
							Transfer Token
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
