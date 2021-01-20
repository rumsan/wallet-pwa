import React from 'react';

export default function SetupButton({ toggleModal }) {
	return (
		<>
			<div className="card-body text-center">
				<div className="row">
					<div className="col-md-12 pr-3 pl-3">
						<button
							onClick={() => toggleModal('passcodeModal')}
							id="btnSetupWallet"
							type="button"
							className="btn btn-block btn-linkedin mb-2"
						>
							<ion-icon name="wallet-outline" className="md hydrated" aria-label="Create New Wallet" />
							Setup My Wallet
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
