import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AppContext } from '../../contexts/AppContext';
import { savePublickey, saveEncyptedWallet } from '../../utils/sessionManager';

export default function Create() {
	let history = useHistory();
	const { encryptedWallet, address, phrases } = useContext(AppContext);

	const handleCancelClick = e => {
		e.preventDefault();
		window.location.replace('/');
	};

	const confirmBackup = async data => {
		const isConfirm = await Swal.fire({
			title: 'Confirmation?',
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

	const handleSaveClick = () => {
		saveEncyptedWallet(encryptedWallet);
		savePublickey(address);
		return confirmBackup();
	};

	return (
		<div id="appCapsule">
			<div className="section full mt-2">
				<div className="section-title" style={{ fontSize: 'larger' }}>
					Please save this 12 word mnemonic safely.
				</div>

				<div className="content-header mb-05">
					<div className="row">
						{phrases && phrases.length > 0 ? (
							phrases.map((word, ind) => {
								return (
									<div key={ind} className="col-sm-3">
										<div className="form-group boxed">
											<div className="input-wrapper">
												<label className="label">&nbsp;word: {ind + 1}</label>
												<input
													type="text"
													className="form-control"
													name={`${word}${ind + 1}`}
													defaultValue={word}
													readOnly
												/>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div className="col-sm-3">No mnemonics found</div>
						)}
					</div>
				</div>

				<div className="text-center mt-3">
					{phrases && phrases.length > 0 && (
						<button
							onClick={handleSaveClick}
							style={{ margin: 5 }}
							className="btn btn-success btn-md"
							id="btnMnemonic"
						>
							I have written it down
						</button>
					)}
					<button onClick={handleCancelClick} className="btn btn-danger btn-md" id="btnCancel">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
