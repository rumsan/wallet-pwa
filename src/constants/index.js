module.exports = {
	APP_CONSTANTS: {
		PASSCODE_LENGTH: 6,
		SCAN_DELAY: 600,
		CONTRACT_NAME: 'rumsan',
		SCANNER_PREVIEW_STYLE: {
			height: 300,
			width: 400,
			display: 'flex',
			justifyContent: 'center'
		},
		SCANNER_CAM_STYLE: {
			display: 'flex',
			justifyContent: 'center',
			marginTop: '-50px',
			padding: '50px',
			marginBottom: '25px'
		}
	},
	BACKUP: {
		GDRIVE_FOLDERNAME: 'RumsanWalletBackups'
	},
	DB: {
		NAME: 'db_wallet',
		VERSION: 1,
		TABLES: {
			DATA: 'tbl_data',
			ASSETS: 'tbl_assets',
			DOCUMENTS: 'tbl_docs'
		}
	},
	DEFAULT_TOKEN: {
		NAME: 'Ether',
		SYMBOL: 'ETH',
		NETWORK: 'ethereum'
	}
};
