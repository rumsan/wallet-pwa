import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';
import { getEncryptedWallet, getTokenAssets } from '../../utils/sessionManager';

const wallet = getEncryptedWallet();

export default function Footer() {
	const { saveTokens, address, lockScreen } = useContext(AppContext);
	const myWallet = wallet ? wallet : address;

	const fetchTokenAssets = () => {
		const tokens = getTokenAssets() || [];
		saveTokens(tokens);
	};

	useEffect(fetchTokenAssets, []);
	return (
		<>
			{!myWallet && ''}
			{myWallet && lockScreen === true && <LockedFooter />}
			{myWallet && lockScreen === false && <UnlockedFooter />}
		</>
	);
}
