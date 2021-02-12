import React from 'react';

export default function ActionButton({ iconName, btnText, imageUrl, handleClick }) {
	return (
		<>
			<div className="col-sm-3" style={{ marginTop: 15 }}>
				<img className="card-img-top" height="194" src={imageUrl} alt="My doc" />
				<div className="card text-center">
					<div className="card-body">
						<button onClick={handleClick} type="button" className="btn btn-success btn-md" id="btnMnemonic">
							<ion-icon name={iconName}></ion-icon> {btnText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
