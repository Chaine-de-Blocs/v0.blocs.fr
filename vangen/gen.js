function getNewAddress() {
	var ec = new KJUR.crypto.ECDSA({'curve': 'secp256k1'});

	// Generates two randoms points (x,y) with corresponding public key and private key
	var keypair = ec.generateKeyPairHex();

	var privkey = keypair.ecprvhex;
	var pubkey = keypair.ecpubhex;

	/**********************************************/
	/*                PUBLIC ADDRESS              */
	/**********************************************/

	var pubSha = KJUR.crypto.Util.hashHex(pubkey, 'sha256');

	// Adds leading 0x00 on ripemd160 of hashed public key for signaling on main network
	var ripemd = '0' + KJUR.crypto.Util.hashHex(pubSha, 'ripemd160');
	var pubRipemd = (0x00).toString(16) + ripemd;

	// Double hash with sha256
	var pubShaRipemd = KJUR.crypto.Util.hashHex(pubRipemd, 'sha256');
	var pubShaShaRipemd = KJUR.crypto.Util.hashHex(pubShaRipemd, 'sha256');

	// 4 leading bytes as checksum
	var checksum = pubShaShaRipemd.slice(0, 8);

	// Final readable public address
	var fullAddress = pubRipemd.concat(checksum);


	/**********************************************/
	/*               PRIVATE KEY (WIP)            */
	/**********************************************/
	// Wallet Import Format

	// Adds leading 0x80 for main network
	privkey = (0x80).toString(16) + privkey;

	// Double hash of private key from ECDSA
	var shaShaPrivkey = KJUR.crypto.Util.hashHex(KJUR.crypto.Util.hashHex(privkey, 'sha256'), 'sha256');

	// 4 leading bytes as checksum
	var privChecksum = shaShaPrivkey.slice(0, 8);

	// Final readable WIP
	privkey = privkey.concat(privChecksum);

	return {
		pub: Base58.encode(toBytes(fullAddress)),
		priv: Base58.encode(toBytes(privkey))
	}
}
