const IPFS_CLIENT = require('ipfs-http-client');
const ipfs = IPFS_CLIENT({
	host: 'localhost',
	port: '5001',
	protocol: 'http'
});

export function mergeAndRemoveDuplicate(array1 = [], array2 = [], keyName) {
	const array3 = [...array1, ...array2];
	// Return unique array on the basis of keyName.
	return [...new Map(array3.map(item => [item[`${keyName}`], item])).values()];
}

export async function uploadToIpfs(file) {
	try {
		return ipfs.add(file);
	} catch (err) {
		throw err;
	}
}

export function dataURLtoFile(dataurl, filename = 'my_doc') {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}
