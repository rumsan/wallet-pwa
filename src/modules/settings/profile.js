import React from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
	return (
		<>
			<div id="appCapsule">
				<div className="section mt-2">
					<div className="profile-head">
						<div className="avatar">
							<img
								src="https://secure.gravatar.com/avatar/cdfda85820e903a90a89e02903223376?s=180&d=identicon"
								alt="avatar"
								className="imaged w64 rounded"
							/>
						</div>
						<div className="in">
							<h3 className="name">This is You</h3>
							<h5 className="subtext">:)</h5>
						</div>
					</div>
				</div>
			</div>
			<div className="section full mb-2">
				<div className="tab-content">
					{/* settings */}
					<div className="tab-pane fade show active" id="settings" role="tabpanel">
						<ul className="listview image-listview text flush transparent pt-1">
							<li>
								<div className="item">
									<div className="in">
										<div>Dark Mode</div>
										<div className="custom-control custom-switch">
											<input
												type="checkbox"
												className="custom-control-input  dark-mode-switch"
												id="customSwitch1"
											/>
											<label className="custom-control-label" htmlFor="customSwitch1" />
										</div>
									</div>
								</div>
							</li>
							<li>
								<Link to="/backup" className="item">
									<div className="in">
										<div>Backup Wallet</div>
									</div>
								</Link>
							</li>
							<li>
								<Link to="/networks" className="item">
									<div className="in">
										<div>Current Network</div>
										<footer>...</footer>
									</div>
								</Link>
							</li>
							<li>
								<Link to="/settings" className="item">
									<div className="in">
										<div>Settings</div>
										<footer>...</footer>
									</div>
								</Link>
							</li>
						</ul>
					</div>
					{/* * settings */}
				</div>
			</div>
		</>
	);
}
