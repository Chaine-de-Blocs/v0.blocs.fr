var searchProcess = new Array();
var baseAddr = '1QLbz7JHiBTspS962RLKV8GndWE';

function toBytes(value) {
	var arr = new Uint8Array(value.length / 2);
	for (var i = 0; i < value.length; i += 2) {
		arr[i / 2] = parseInt(value.substring(i, i + 2), 16);
	}
	return arr;
}

function onPatternChange(e) {
  var pat = document.querySelector('#pattern-form').elements.namedItem('pattern').value;
  switch (e.key) {
    case 'Enter':
      generate(e);
      break;
    default:
			var prev = document.querySelector('#addr-preview');
			if (pat.length === 0) {
				prev.innerHTML = baseAddr;
				return;
			}
			prev.innerHTML = '1' + pat + baseAddr.slice(pat.length + 1);
  }
}

function showPrivKey(e) {
	e.preventDefault();
	document.querySelector('#privkey input').setAttribute('type', 'text');
}

function generate(e) {
	e.preventDefault();
	var pat = document.querySelector('#pattern-form').elements.namedItem('pattern').value;

	searchProcess = setInterval(() => {
		var addr = getNewAddress();

		var pattMatch = addr.pub.slice(1, pat.length + 1);

		document.querySelector('#address').value = addr.pub;

		if (pattMatch === pat) {
			document.querySelector('#privkey input').value = addr.priv;
			document.querySelector('#privkey').style.display = 'block';
			stop(e);
		}
	});
}

function stop(e) {
	e.preventDefault();
	clearInterval(searchProcess);
}
