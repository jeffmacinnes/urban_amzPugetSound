/**
 * pushEvent will fire either a GA4-compliant event
 * or a Google Analytics-compliant view event
 *
 * @param {String} eventName - the name of the fired event
 * @param {String} firingModuleName - the name of the module firing the event; ie, what is this iframe?
 * @param {Object} data - an optional object that will be added to the event detail (default: `{}`)
 */

export function pushEvent(eventName, firingModuleName, data = {}) {
	let messageData;
	if (eventName && firingModuleName) {
		messageData = {
			event: eventName,
			'event-module-name': firingModuleName,
			'event-type': 'custom'
		};

		for (let property in data) {
			messageData[property] = data[property];
		}

		window.dataLayer.push(messageData);
	}
}
