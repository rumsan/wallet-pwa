import React from 'react';
import { useHistory } from 'react-router-dom';

export default function LockedFooter() {
	let history = useHistory();

	const handleUnlockClick = () => {
		history.push('/unlock');
	};

	return (
		<>
			<div className="footer-locked">
				<div className="appBottomMenu">
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#screen" className="item" id="btnUnlock" onClick={handleUnlockClick}>
						<div className="col">
							<div className="action-button large">
								<ion-icon name="lock-closed" />
							</div>
						</div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
					<a href="#target" className="item">
						<div className="col"></div>
					</a>
				</div>
			</div>
		</>
	);
}
