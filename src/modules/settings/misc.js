import React, { useState, useEffect } from 'react';
import AppHeader from '../layouts/AppHeader';
import DataService from '../../services/db';

export default function ImportToken() {
	const [ipfs, setIpfs] = useState(null);

	const changeIpfs = async e => {
		const { value } = e.target;
		setIpfs(value);
		if (value.length > 5) DataService.saveIpfsUrl(value);
		else DataService.saveIpfsUrl(null);
	};

	useEffect(() => {
		(async () => {
			let ipfsUrl = await DataService.getIpfsUrl();
			console.log(process.env.REACT_APP_DEFAULT_IPFS);
			setIpfs(ipfsUrl);
		})();
	}, []);

	return (
		<>
			<AppHeader currentMenu="Settings" />
			<div id="appCapsule">
				<div id="cmpMain">
					<div className="section mt-2 mb-5">
						<div className="card mt-5" id="cmpTransfer">
							<div className="card-body">
								<div className="form-group boxed" style={{ padding: 0 }}>
									<div className="input-wrapper">
										<label className="label">IPFS Upload Url:</label>
										<div className="input-group mb-3">
											<input
												type="text"
												className="form-control"
												placeholder="Enter full IPFS url"
												value={ipfs}
												onChange={changeIpfs}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
