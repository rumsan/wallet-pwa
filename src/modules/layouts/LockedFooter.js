import React from 'react';

export default function LockedFooter() {
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
					<a href="#unlock" className="item" id="btnUnlock">
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
