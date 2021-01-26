import React from 'react';

export default function SetupButton({ handleGoogleRestoreClick, toggleMyModal }) {
	return (
		<>
			<div className="card-body text-center">
				<div className="row">
					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={toggleMyModal}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-linkedin mb-2"
						>
							<ion-icon name="wallet-outline" className="md hydrated" aria-label="Create New Wallet" />
							Setup My Wallet
						</button>
					</div>

					<div className="col-md-12 pr-3 pl-3">
						<button id="btnSetupWallet" type="button" className="btn btn-block btn-bitcoin mb-2">
							<ion-icon
								name="wallet-outline"
								className="md hydrated"
								aria-label="Restore Existing Wallet"
							/>
							Restore Using Mnemonic
						</button>
					</div>

					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={handleGoogleRestoreClick}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-success mb-2"
						>
							<ion-icon name="logo-google" className="md hydrated" aria-label="Restore Using Google" />
							Restore Using Google
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
