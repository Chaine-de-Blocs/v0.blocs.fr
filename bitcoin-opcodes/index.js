let exec;

function submitEditor(e, execFullStack) {
  e.preventDefault();
  e.stopPropagation();

  let form = document.querySelector('#editor-form');

  let script = form['output-script'].value.split(' ');
  let stack = form['input-script'].value.length > 0 ? form['input-script'].value.split(' ') : new Array();

  if (!exec) {
    exec = new StackExecutor(stack, script);
    renderStack(exec.stack);
  }

  if (execFullStack) {
    let res;
    while(!exec.isTerminated()) {
      exec.nextStep();
      renderStack(exec.stack);
    }
  } else if (!exec.isTerminated()) {
    exec.nextStep();
    renderStack(exec.stack);
  }

  if (exec.isTerminated()) {
    renderResult(exec);
  }
}

function renderStack(stack) {
  let nextCode = exec.script[exec.stepIndex] ? exec.script[exec.stepIndex] : 'Terminus';
  document.querySelector('#opcode').innerHTML = `<h1>${exec.script[exec.stepIndex - 1]} > ${nextCode}</h1>`;

  let stackDiv = document.querySelector('#stack');

  if (stack.length > stackDiv.childNodes.length) {
    for (let i = stackDiv.childNodes.length; i < stack.length; i++) {
      let item = document.createElement('div');
      item.setAttribute('data-index', i);
      item.innerHTML = stack[i];

      stackDiv.appendChild(item);
    }
    return;
  }

  for (let i = 0; i < stack.length; i++) {
    let item = stackDiv.childNodes[i];
    item.innerHTML = stack[item.dataset.index];
  }

  for (let i = stackDiv.childNodes.length - 1; i >= stack.length; i--) {
    stackDiv.removeChild(stackDiv.childNodes[i]);
  }
}

function renderResult(_exec) {
  let resDiv = document.querySelector('#result');
  if (_exec.result) {
    resDiv.innerHTML = `<h2>Le script est valide !</h2>`;
  } else {
    resDiv.innerHTML = `<h2>Le script est invalide !</h2>`;
  }
}

function reset(e){
  exec = null;
  document.querySelector('#result').innerHTML = '';
  document.querySelector('#opcode').innerHTML = '';
  document.querySelector('#stack').innerHTML = '';
  return false;
}
