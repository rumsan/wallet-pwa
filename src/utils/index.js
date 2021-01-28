export function mergeAndRemoveDuplicate(array1 = [], array2 = [], keyName) {
	const array3 = [...array1, ...array2];
	// Return unique array on the basis of keyName.
	return [...new Map(array3.map(item => [item[`${keyName}`], item])).values()];
}
