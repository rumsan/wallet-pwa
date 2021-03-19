export default class {
	constructor(name, version, table) {
		Object.assign(this, { name, version, table });
	}

	static setupDatabase(name, version, setupStoresFn) {
		return new Promise((resolve, reject) => {
			let request = window.indexedDB.open(name, version);
			request.onupgradeneeded = function () {
				setupStoresFn(request.result);
				resolve();
			};
			request.onerror = function () {
				reject(request.error);
			};
		});
	}

	static deleteDatabase(name) {
		return new Promise((resolve, reject) => {
			let dRequest = window.indexedDB.deleteDatabase(name);
			dRequest.onerror = function () {
				reject(dRequest.error);
			};
		});
	}

	get(key) {
		let me = this;
		return new Promise((resolve, reject) => {
			let oRequest = window.indexedDB.open(me.name, me.version);
			oRequest.onsuccess = function () {
				let db = oRequest.result;
				let tx = db.transaction(me.table, 'readonly');
				let st = tx.objectStore(me.table);
				let gRequest = st.get(key);
				gRequest.onsuccess = function () {
					resolve(gRequest.result);
				};
				gRequest.onerror = function () {
					reject(gRequest.error);
				};
			};
			oRequest.onerror = function () {
				reject(oRequest.error);
			};
		});
	}

	list(withKeys = false) {
		let me = this;
		return new Promise((resolve, reject) => {
			let oRequest = window.indexedDB.open(me.name, me.version);
			oRequest.onsuccess = function () {
				let db = oRequest.result;
				let tx = db.transaction(me.table, 'readonly');
				let st = tx.objectStore(me.table);

				let cursorRequest = st.openCursor();
				cursorRequest.onerror = function (error) {
					reject(error);
				};

				let items = [];
				cursorRequest.onsuccess = function (evt) {
					let cursor = evt.target.result;
					if (cursor) {
						if (withKeys) items.push({ key: cursor.key, value: cursor.value });
						else items.push(cursor.value);
						cursor.continue();
					}
					resolve(items);
				};
			};
			oRequest.onerror = function () {
				reject(oRequest.error);
			};
		});
	}

	set(value, key) {
		let me = this;
		return new Promise((resolve, reject) => {
			let oRequest = window.indexedDB.open(this.name, this.version);
			oRequest.onsuccess = function () {
				let db = oRequest.result;
				let tx = db.transaction(me.table, 'readwrite');
				let st = tx.objectStore(me.table);
				let sRequest = st.put(value, key);
				sRequest.onsuccess = function () {
					resolve();
				};
				sRequest.onerror = function () {
					reject(sRequest.error);
				};
			};
			oRequest.onerror = function () {
				reject(oRequest.error);
			};
		});
	}

	remove(key) {
		let me = this;
		return new Promise((resolve, reject) => {
			let oRequest = window.indexedDB.open(this.name, this.version);
			oRequest.onsuccess = function () {
				let db = oRequest.result;
				let tx = db.transaction(me.table, 'readwrite');
				let st = tx.objectStore(me.table);
				let rRequest = st.delete(key);
				rRequest.onsuccess = function () {
					resolve();
				};
				rRequest.onerror = function () {
					reject(rRequest.error);
				};
			};
			oRequest.onerror = function () {
				reject(oRequest.error);
			};
		});
	}
}
