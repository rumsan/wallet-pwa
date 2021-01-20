import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';

export default function Footer() {
	const { lockScreen } = useContext(AppContext);
	console.log('FOoter Lock==>', lockScreen);
	return <>{lockScreen === true ? <LockedFooter /> : <UnlockedFooter />}</>;
}
