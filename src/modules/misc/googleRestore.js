import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GoogleRestore() {
	const [progressMessage, setProgressMessage] = useState('Restoring wallet from google drive...');
	const [progressWidth, setProgressWidth] = useState(0);
	const [loading, setLoading] = useState(false);
	const [showHomeButton, setShowHomeButton] = useState(false);

	return (
		<div id="appCapsule">
			<div id="cmpMain">
				<div className="section full mt-2">
					<div className="text-center" style={{ marginTop: 100 }}>
						<h4 className="subtitle">{progressMessage}</h4>
					</div>
					<div>
						<div className="progress" style={{ margin: '50px 80px 3px' }}>
							<div
								className="progress-bar"
								style={{ width: `${progressWidth}%` }}
								role="progressbar"
								aria-valuenow={25}
								aria-valuemin={0}
								aria-valuemax={100}
							/>
						</div>
						<div className="text-center">
							<small className="text-success message" />
						</div>
						<div className="text-center">
							{showHomeButton && (
								<Link to="/" className="btn btn-primary btn-home mt-3">
									Go to Home
								</Link>
							)}
							{loading && <div className="spinner-border text-success mt-5 in-progress" role="status" />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
