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
		const callFnNow = (args) => {
			immediateCallTimer = setTimeout(clearImmediateCallTimer, delay);
			fn.apply(this, args);
		}
		
		const callFnLater = (args) => {
			delayedCallTimer = setTimeout(() => {
				fn.apply(this, args);
				immediately && (immediateCallTimer = setTimeout(clearImmediateCallTimer, delay));
				delayedCallTimer = null;
			}, delay);
		}

		function clearImmediateCallTimer() {
			immediateCallTimer = null;
		}	

		if (immediately && !immediateCallTimer) return callFnNow(args);
		
		immediately && clearTimeout(immediateCallTimer);
		delayedCallTimer && clearTimeout(delayedCallTimer);
		callFnLater(args);
	}	
}

function throttle(func, ms) {
	let timer = null;

    function wrapper(...args) {
        if (timer) {
            return;
        }

        func.apply(this, args);

        timer = setTimeout(() => {
			wrapper.apply(this, args);
			clearTimeout(timer);
			timer = null;
        }, ms);
    }

    return wrapper;
}

function createHtmllements(descriptions) {
    let elements = [];
    for (let i = 0; i < descriptions.length; i +=2) {
        elements.push(createHtmlElement(descriptions[i], descriptions[i+1]));
    }
    return elements;
}

function createHtmlElement(tagName, props = {}) {
    let htmlElement = document.createElement(tagName);
    for (let prop in props) {
		htmlElement.setAttribute(prop, props[prop]);
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

export { curry, promisify, debounce, throttle, createHtmllements, createHtmlElement, mergeIntoComponent };