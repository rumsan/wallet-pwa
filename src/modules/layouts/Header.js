import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getEncryptedWallet } from '../../utils/sessionManager';

const wallet = getEncryptedWallet();

export default function Header() {
	const { address, lockAppScreen } = useContext(AppContext);

	const myWallet = wallet ? wallet : address;

	const handleLockAppClick = () => {
		lockAppScreen();
	};

	return (
		<div>
			{myWallet && (
				<div className="appHeader bg-primary scrolled">
					<div className="left d-none">
						<a href="fake_value" className="headerButton" data-toggle="modal" data-target="#sidebarPanel">
							<ion-icon name="home-outline" />
						</a>
					</div>
					<div className="pageTitle">Rumsan Sanduk</div>
					<div className="right">
						<a
							href="#lock"
							title="Lock wallet"
							onClick={handleLockAppClick}
							className="headerButton logout"
						>
							<ion-icon name="wallet-outline" />
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
