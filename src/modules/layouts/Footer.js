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
import { mergeAndRemoveDuplicate } from '../../utils/index';

const wallet = getEncryptedWallet();
const tokens = getTokenAssets();
const pubKey = getPublicKey();
const { CONTRACT_NAME } = APP_CONSTANTS;

export default function Footer() {
	const { saveTokens, address, lockScreen } = useContext(AppContext);
	const myWallet = wallet ? wallet : address;

	const refreshCurrentNetwork = () => {
		const current = getCurrentNetwork();
		const network = getNetworkByName();
		if (!current) saveCurrentNetwork(network);
	};

	useEffect(() => {
		async function fetchTokenDetails() {
			const publicKey = address ? address : pubKey;
			refreshCurrentNetwork();
			let newData = [];
			if (tokens && tokens.length) {
				try {
					for (let t of tokens) {
						let tokenAbi = await getAbi(CONTRACT_NAME);
						let TokenContract = await ethersContract(tokenAbi, t.contract);
						let balance = await TokenContract.balanceOf(publicKey);
						let tokenBalance = balance.toNumber();
						let symbol = await TokenContract.symbol();
						let decimal = await TokenContract.decimals();
						newData.push({ contract: t.contract, tokenBalance, symbol, decimal });
					}
					const merged = mergeAndRemoveDuplicate(tokens, newData, 'symbol');
					saveTokens(merged);
				} catch (err) {}
			}
		}

		fetchTokenDetails();
	}, [address, saveTokens]);

	return (
		<>
			{!myWallet && ''}
			{myWallet && lockScreen === true && <LockedFooter />}
			{myWallet && lockScreen === false && <UnlockedFooter />}
		</>
	);
}
