import React, { useContext } from 'react';

import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';

export default function Footer() {
	const { hasWallet, wallet } = useContext(AppContext);

	return (
		<>
			{hasWallet ? (
				<>
					{wallet === null && <LockedFooter />}
					{wallet !== null && <UnlockedFooter />}
				</>
			) : (
				''
			)}
		</>
	);
}
