import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';

export default function Footer() {
	const { lockScreen } = useContext(AppContext);
	return <>{lockScreen === true ? <LockedFooter /> : <UnlockedFooter />}</>;
}
