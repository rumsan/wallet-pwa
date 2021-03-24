import React, { useEffect, useState, useContext } from 'react';
import AppHeader from '../layouts/AppHeader';
import EtherImg from '../../assets/images/ether.png';
import { useHistory } from 'react-router-dom';
import DataService from '../../services/db';

import { AppContext } from '../../contexts/AppContext';

export default function Details(props) {
	let history = useHistory();
	const { network } = useContext(AppContext);
	let tokenAddress = props.match.params.address;

	const [tokenDetails, setTokenDetails] = useState(null);

	useEffect(() => {
		(async () => {
			const token = await DataService.getAsset(tokenAddress);
			if (token) setTokenDetails(token);
		})();
	}, [tokenAddress]);

	const handleTransferClick = async e => {
		e.preventDefault();
		history.push('/transfer/' + tokenAddress);
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
									<h3 className="title">{tokenDetails ? tokenDetails.name : 'N/A'}</h3>
									<p className="detail">{tokenDetails && tokenDetails.symbol}</p>
									<strong className="price"> {tokenDetails && tokenDetails.balance}</strong>
								</div>
							</div>
							<div className="cart-item-footer">
								<div className="stepper  stepper-secondary">
									<span style={{ fontSize: '0.8rem' }}>{network && network.display}</span>
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
