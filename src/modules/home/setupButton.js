import React from 'react';

export default function SetupButton({ togglePasscodeModal }) {
	return (
		<>
			<div className="card-body text-center">
				<div className="row">
					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={() => togglePasscodeModal('passcodeModal')}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-linkedin mb-2"
						>
							<ion-icon name="wallet-outline" className="md hydrated" aria-label="Create New Wallet" />
							Create new wallet
						</button>
					</div>

					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={() => togglePasscodeModal('restoreModal')}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-bitcoin mb-2"
						>
							<ion-icon
								name="wallet-outline"
								className="md hydrated"
								aria-label="Restore Existing Wallet"
							/>
							Restore wallet from seed phrase (mnemonic)
						</button>
					</div>

					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={() => togglePasscodeModal('restoreFromGdrive')}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-success mb-2"
						>
							<ion-icon name="logo-google" className="md hydrated" aria-label="Restore Using Google" />
							Restore wallet from Google Drive
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
