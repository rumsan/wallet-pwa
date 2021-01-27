import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';
import { getEncryptedWallet } from '../../utils/sessionManager';

const wallet = getEncryptedWallet();

export default function Footer() {
	const { address, lockScreen } = useContext(AppContext);
	const myWallet = wallet ? wallet : address;
	return (
		<>
			{!myWallet && ''}
			{myWallet && lockScreen === true && <LockedFooter />}
			{myWallet && lockScreen === false && <UnlockedFooter />}
		</>
	);
}
