import Dexie from 'dexie';

import { DB } from '../constants';
import { getDefaultNetwork } from '../constants/networks';

const db = new Dexie(DB.NAME);
db.version(DB.VERSION).stores({
	data: 'name,data',
	documents: 'hash,name,file,createdAt',
	assets: 'address,name,symbol,decimal,balance,network'
});

export default {
	save(name, data) {
		return db.data.put({ name, data });
	},

	async get(name) {
		let obj = await db.data.get(name);
		if (!obj) return null;
		return obj.data;
	},

	remove(name) {
		return db.data.delete(name);
	},

	async initAppData() {
		let network = await this.getNetwork();
		let address = await this.getAddress();
		let wallet = await this.getWallet();
		return { network, address, wallet };
	},

	saveNetwork(network) {
		return this.save('network', network);
	},

	async getNetwork() {
		let network = await this.get('network');
		if (!network) return getDefaultNetwork();
		return network;
	},

	saveIpfsUrl(ipfsUrl) {
		return this.save('ipfsUrl', ipfsUrl);
	},

	async getIpfsUrl() {
		let ipfs = await this.get('ipfsUrl');
		if (!ipfs) return process.env.REACT_APP_DEFAULT_IPFS;
		return ipfs;
	},

	saveAddress(address) {
		localStorage.setItem('address', address);
		return this.save('address', address);
	},

	getAddress() {
		return this.get('address');
	},

	getAddressFromLocal() {
		return localStorage.getItem('address');
	},

	async saveWallet(wallet) {
		console.log(wallet);
		return this.save('wallet', wallet);
	},

	getWallet() {
		return this.get('wallet');
	},

	async saveDocuments(docs) {
		if (!Array.isArray(docs)) docs = [docs];
		return db.documents.bulkAdd(docs);
	},

	getDocument(hash) {
		return db.documents.get(hash);
	},

	listDocuments() {
		return db.documents.toArray();
	},

	getAsset(address) {
		return db.assets.get(address);
	},

	async addDefaultAsset(symbol, name) {
		let asset = await this.getAsset('default');
		if (!asset) return db.assets.add({ address: 'default', symbol, name, decimal: 18, balance: 0 });
	},

	async addMultiAssets(assets) {
		if (!Array.isArray(assets)) assets = [assets];
		return db.assets.bulkAdd(assets);
	},

	saveAsset(asset) {
		return db.assets.put(asset);
	},

	async updateAsset(key, asset) {
		return db.assets.update(key, asset);
	},

	listAssets(network) {
		if (!network) return db.assets.toArray();
		return db.assets.filter(a => a.network === undefined || a.network.name === network).toArray();
	}
};
