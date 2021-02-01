import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';
import {
	getPublicKey,
	getCurrentNetwork,
	getEncryptedWallet,
	getTokenAssets,
	saveCurrentNetwork
} from '../../utils/sessionManager';
import { APP_CONSTANTS } from '../../constants';
import { getNetworkByName } from '../../constants/networks';
import { ethersContract, getAbi } from '../../utils/blockchain/abi';

const wallet = getEncryptedWallet();
const tokens = getTokenAssets();
const { CONTRACT_NAME } = APP_CONSTANTS;

export default function Footer() {
	const { saveTokens, address, lockScreen } = useContext(AppContext);
	const myWallet = wallet ? wallet : address;

	const refreshCurrentNetwork = () => {
		const current = getCurrentNetwork();
		const network = getNetworkByName();
		if (!current) saveCurrentNetwork(network);
		//	saveTokens(tokens);
	};

	useEffect(() => {
		(async function anyNameFunction() {
			refreshCurrentNetwork();
			if (tokens && tokens.length) {
				let pubKey = getPublicKey();
				for (let t of tokens) {
					let tokenAbi = await getAbi(CONTRACT_NAME);
					let TokenContract = await ethersContract(tokenAbi, t.contract);
					let balance = await TokenContract.balanceOf(address ? address : pubKey);
					let numBalance = balance.toNumber();
					console.log('Balance==>', numBalance);
				}
			}
		})();
	}, [address]);

	return (
		<>
			{!myWallet && ''}
			{myWallet && lockScreen === true && <LockedFooter />}
			{myWallet && lockScreen === false && <UnlockedFooter />}
		</>
	);
}
