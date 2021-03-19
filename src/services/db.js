import { DB } from '../constants';
import DataStore from '../utils/indexedDb';

let store = new DataStore(DB.NAME, DB.VERSION, DB.TABLES.DATA);
let documentStore = new DataStore(DB.NAME, DB.VERSION, DB.TABLES.DOCUMENTS);
let assetStore = new DataStore(DB.NAME, DB.VERSION, DB.TABLES.ASSETS);

export default {
	initialize() {
		DataStore.setupDatabase(DB.NAME, DB.VERSION, db => {
			db.createObjectStore(DB.TABLES.DATA);
			db.createObjectStore(DB.TABLES.DOCUMENTS, { keyPath: 'hash' });
			db.createObjectStore(DB.TABLES.ASSETS, { keyPath: 'address' });
		});
	},

	add(key, value) {
		return store.set(value, key);
	},

	get(key) {
		return store.get(key);
	},

	savePublickey(value) {
		localStorage.setItem('publicKey', value);
		return store.set(value, 'publicKey');
	},

	getPublicKey() {
		return store.get('publicKey');
	},

	saveEncyptedWallet(data) {
		localStorage.setItem('wallet', JSON.stringify(JSON.stringify(data)));
		return store.set(data, 'wallet');
	},

	getEncryptedWallet() {
		return store.get('wallet');
	},

	async saveDocuments(docs) {
		if (!Array.isArray(docs)) docs = [docs];
		for (let doc of docs) {
			await documentStore.set(doc);
		}
	},

	getDocument(hash) {
		return documentStore.get(hash);
	},

	async saveAssets(assets) {
		if (!Array.isArray(assets)) assets = [assets];
		for (let asset of assets) {
			await assetStore.set(asset);
		}
	},

	getAsset(address) {
		return assetStore.get(address);
	}
};
