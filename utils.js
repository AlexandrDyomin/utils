function curry(fn, ...args) {
	return function curried(..._args) {
		let totalNumberOfArgs = args.length + _args.length;
		if (totalNumberOfArgs >= fn.length) return fn.call(this, ...args, ..._args);
		return curried.bind(this, ..._args);
	}
}

function promisify(fn) {
	return function promisified(...args) {
		return new Promise((resolve, reject) => {
			fn.call(this, ...args, (err, res) => err ? reject(err) : resolve(res));
		});
	} 
}

function debounce(fn, delay, immediately = false) {
	let immediateCallTimer = null;
	let delayedCallTimer = null;

	return function debounced(...args) {
		if (immediately && !immediateCallTimer) return callFnNow(args);
		
		immediately && clearTimeout(immediateCallTimer);
		delayedCallTimer && clearTimeout(delayedCallTimer);
		callFnLater(args);
	}	

	function callFnNow(args) {
		immediateCallTimer = setTimeout(clearImmediateCallTimer, delay);
		fn.apply(this, args);
	}

	function callFnLater(args) {
		delayedCallTimer = setTimeout(function callFn() {
			fn.apply(this, args);
			immediately && (immediateCallTimer = setTimeout(clearImmediateCallTimer, delay));
			delayedCallTimer = null;
		}, delay);
	}

	function clearImmediateCallTimer() {
		immediateCallTimer = null;
	}	
}


function createHtmlElement(tagName, props = {}) {
    let htmlElement = document.createElement(tagName);
    for (let prop in props) {
        htmlElement[prop] = props[prop];
    };
    return htmlElement;
}

function mergeIntoComponent(root, elements) {
    for (let [i, element] of Object.entries(elements)) {
        if (Array.isArray(element)) {
            element = mergeIntoComponent(elements[i-1], elements[i]);
        }
        root.append(element);
    }
    return root;
}

export { curry, promisify, debounce, createHtmlElement, mergeIntoComponent };