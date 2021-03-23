import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { AppContext } from '../../contexts/AppContext';
import LockedFooter from './LockedFooter';
import UnlockedFooter from './UnlockedFooter';
import { getPublicKey, getTokenAssets } from '../../utils/sessionManager';
import { APP_CONSTANTS } from '../../constants';
import { mergeAndRemoveDuplicate } from '../../utils/index';

const tokens = getTokenAssets();
const pubKey = getPublicKey();
const { CONTRACT_NAME } = APP_CONSTANTS;

export default function Footer() {
	let history = useHistory();

	const { saveTokens, address, hasWallet, wallet } = useContext(AppContext);

	// useEffect(() => {
	// 	async function fetchTokenDetails() {
	// 		const publicKey = address ? address : pubKey;
	// 		let newData = [];
	// 		if (tokens && tokens.length) {
	// 			try {
	// 				for (let t of tokens) {
	// 					let tokenAbi = await getAbi(CONTRACT_NAME);
	// 					let TokenContract = await ethersContract(tokenAbi, t.contract);
	// 					let balance = await TokenContract.balanceOf(publicKey);
	// 					let tokenBalance = balance.toNumber();
	// 					let tokenName = await TokenContract.name();
	// 					let symbol = await TokenContract.symbol();
	// 					let decimal = await TokenContract.decimals();
	// 					newData.push({ contract: t.contract, tokenBalance, symbol, decimal, tokenName });
	// 				}
	// 				const merged = mergeAndRemoveDuplicate(tokens, newData, 'symbol');
	// 				saveTokens(merged);
	// 			} catch (err) {}
	// 		}
	// 	}

	// 	fetchTokenDetails();
	// }, [address, history, saveTokens]);

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
