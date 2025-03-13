export function encrypt(text, key) {
	let encrypted = "";
	for (let i = 0; i < text.length; i++) {
		let charCode = text.charCodeAt(i);
		let shiftedCode = charCode + (key % 256);
		encrypted += String.fromCharCode(shiftedCode);
	}
	return btoa(encrypted);
}

export function decrypt(encryptedText, key) {
	let decoded = atob(encryptedText);
	let decrypted = "";
	for (let i = 0; i < decoded.length; i++) {
		let charCode = decoded.charCodeAt(i);
		let originalCode = charCode - (key % 256);
		decrypted += String.fromCharCode(originalCode);
	}
	return decrypted;
}
