var searchProcesses = new Array();
var baseAddr = '1QLbz7JHiBTspS962RLKV8GndWE';
var nbAddr = 0;
var timer;

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
	nbAddr = 0;

	timer = setInterval(() => {
		// TODO Timer with nbAddr calculated each seconds
	}, 1000);

	searchProcesses[0] = new Worker('gen.js');

  // Only the first worker refresh the view for trial & error phase
  searchProcesses[0].onmessage = function(e) {
    nbAddr += 1;

    refreshAddressesView(e.data.pub, null);

    if (isValid(e.data.pub)) {
  		refreshAddressesView(e.data.pub, e.data.priv);
  		stop(null);
  	}
  }

  // Runs 3 workers
  for (var i = 1; i <= 3; i++) {
    searchProcesses[i] = new Worker('gen.js');
    searchProcesses[i].onmessage = function(e) {
      nbAddr += 1;

      if (isValid(e.data.pub)) {
        refreshAddressesView(e.data.pub, e.data.priv);
        stop(null);
      }
    }
  }
}

function refreshTimers(approxTime, timer) {
  document.querySelector('#approx-time').innerHTML = approxTime;
  document.querySelector('#timer').innerHTML = timer;
}

function refreshAddressesView(pubAddress, privKey) {
  document.querySelector('#address').value = pubAddress;

  if (privKey) {
    document.querySelector('#privkey input').value = privKey;
    document.querySelector('#privkey').style.display = 'block';
  }
}

function isValid(address) {
  var pat = document.querySelector('#pattern-form').elements.namedItem('pattern').value;
  var pattMatch = address.slice(1, pat.length + 1);
  return pattMatch === pat;
}

function stop(e) {
	if (e) e.preventDefault();
  clearInterval(timer);
  for (p of searchProcesses) {
    p.terminate();
  }
}
