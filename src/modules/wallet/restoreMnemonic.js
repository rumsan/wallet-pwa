import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AppContext } from '../../contexts/AppContext';
import { savePublickey, saveEncyptedWallet } from '../../utils/sessionManager';
import Wallet from '../../utils/blockchain/wallet';
import Loading from '../global/Loading';

export default function RestoreMnemonic() {
	let history = useHistory();
	const { passcode, saveAppWallet } = useContext(AppContext);
	const [loading, setLoading] = useState(false);

	const handleCancelClick = e => {
		e.preventDefault();
		window.location.replace('/');
	};

	const confirmBackup = async () => {
		const isConfirm = await Swal.fire({
			title: 'Success',
			icon: 'success',
			html: `Would you like to backup your wallet in Google Drive`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Backup',
			cancelButtonText: 'No, Take to homepage'
		});
		if (isConfirm.value) {
			history.push('/google/backup');
		} else {
			history.push('/');
		}
	};

	let rows = [];
	for (let i = 0; i < 12; i++) {
		let column = (
			<div key={i + 1} className="col-sm-3">
				<div className="form-group boxed">
					<div className="input-wrapper">
						<label className="label">Word: {i + 1}</label>
						<input type="text" className="form-control" name={`word${i + 1}`} required />
					</div>
				</div>
			</div>
		);
		rows.push(column);
	}

	const restoreWallet = async mnemonic => {
		try {
			setLoading(true);
			const w = new Wallet({ passcode });
			const res = await w.create(mnemonic);
			const { privateKey, address, encryptedWallet } = res;
			const payload = { privateKey, address };
			savePublickey(address);
			saveEncyptedWallet(encryptedWallet);
			saveAppWallet(payload);
			setLoading(false);
			return confirmBackup();
		} catch (err) {
			Swal.fire('ERROR', err.message, 'error');
			setLoading(false);
		}
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		let words = [];
		const formData = new FormData(e.target);
		for (let i = 1; i < 13; i++) {
			let word = formData.get(`word${i}`);
			words.push(word);
		}
		const mnemonic = words.join(' ');
		return restoreWallet(mnemonic);
	};

	return (
		<>
			<Loading message="Restoring your wallet. Please wait..." showModal={loading} />
			<div id="appCapsule">
				<div className="section full mt-2">
					<div className="section-title" style={{ fontSize: 'larger' }}>
						Please enter 12 word mnemonics
					</div>
					<form onSubmit={handleFormSubmit}>
						<div className="content-header mb-05">
							<p>One word in each box</p>
							<div className="row">
								{rows &&
									rows.map(col => {
										return col;
									})}
							</div>
						</div>

						<div className="text-center mt-3">
							<button
								type="submit"
								style={{ margin: 5 }}
								className="btn btn-success btn-md"
								id="btnMnemonic"
							>
								Submit
							</button>
							<button onClick={handleCancelClick} className="btn btn-danger btn-md" id="btnCancel">
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
