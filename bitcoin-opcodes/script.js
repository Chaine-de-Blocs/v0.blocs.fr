// https://en.bitcoin.it/wiki/Script
const CODES = {
	OP_O: 0,
  OP_FALSE: 0,
  OP_1: 1,
  OP_TRUE: 1,
  OP_2: 2,
  OP_3: 3,
  OP_4: 4,
  OP_5: 5,
  OP_6: 6,
  OP_7: 7,
  OP_8: 8,
  OP_9: 9,

  OP_ADD: '<INPUT INPUT> Sum them up',
  OP_SUB: '<INPUT INPUT> Substract them',

  OP_DUP: '<INPUT> Duplicate the input and put it in the stack',

  OP_HASH160: '<INPUT> The input is hashed twice: first with SHA-256 and then with RIPEMD-160.',

  OP_EQUAL: 'Returns 1 if the inputs are exactly equal, 0 otherwise.',
  OP_VERIFY: 'Marks transaction as invalid if top stack value is not true. The top stack value is removed.',

  OP_EQUALVERIFY: 'Same as OP_EQUAL, but runs OP_VERIFY afterward.',
  OP_CHECKSIG: 'check tx signature'
}

class StackExecutor {

	constructor(stack, script) {
		this.stack = stack;
		this.script = script;
		this.stepIndex = 0;

		this.error = null;
		this.result = null;
	}

	nextStep() {
	  let calcVal, doVerify;
  	let code = this.script[this.stepIndex];
    let stackLastIndex = this.stack.length - 1;
  	switch(code) {
    	/* op codes for data */
    	case 'OP_0':
      case 'OP_FALSE':
      case 'OP_1':
      case 'OP_2':
      case 'OP_3':
      case 'OP_4':
      case 'OP_5':
      case 'OP_6':
      case 'OP_7':
      case 'OP_8':
      case 'OP_9':
      	this.stack.push(CODES[code]);
        break;

      /* op codes that take 2 inputs and remove them */
      case 'OP_SUB':
      	calcVal = this.stack[stackLastIndex - 1] - this.stack[stackLastIndex];
      case 'OP_ADD':
      	calcVal = calcVal ? calcVal : this.stack[stackLastIndex - 1] + this.stack[stackLastIndex];

        // Removes inputs
        this.stack.splice(stackLastIndex - 1, 2);

        this.stack.push(calcVal);

        break;

      case 'OP_DUP':
        this.stack.push(this.stack[stackLastIndex]);

        break;

      case 'OP_HASH160':
      	let sha256 = CryptoJS.SHA256(this.stack[stackLastIndex]).toString();

        this.stack[stackLastIndex] = CryptoJS.RIPEMD160(sha256).toString();

        break;

      case 'OP_EQUALVERIFY':
      	doVerify = true;
      case 'OP_EQUAL':
      	let equal = this.stack[stackLastIndex] == this.stack[stackLastIndex - 1];

        // Removes inputs
        this.stack.splice(stackLastIndex - 1, 2);

        this.stack.push(equal ? 1 : 0);

      	stackLastIndex = this.stack.length - 1;

        if (!doVerify) break;
    	case 'OP_VERIFY':
      	let input = this.stack[stackLastIndex];

        this.stack.splice(stackLastIndex, 1);

      	if (input != 1) {
					this.result = false;
					return;
				}

				break;

     	case 'OP_CHECKSIG':
				// var ec = new KJUR.crypto.ECDSA({'curve': 'secp256k1'});
				// let msg = CryptoJS.SHA256(CryptoJS.SHA256(this.script.toString())).toString();
				//
				// let sig = this.stack[stackLastIndex - 1];
				// let pubKey = this.stack[stackLastIndex];
				// TODO Check signature using ECDSA

        this.stack.splice(stackLastIndex - 1, 2);

        this.stack.push(1);
        break;

    	default:
      	this.stack.push(code);
    }

		this.stepIndex++;

		if (this.stepIndex >= this.script.length) {
			this.result = this.stack[this.stack.length - 1] == 1;
    }
	}

	isTerminated() {
		return (this.result != null) || (this.error != null);
	}
}
