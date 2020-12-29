(() => {
	const fs = require('fs');
	let path = __dirname + '/ping';
	if (!fs.existsSync(path + '.js')) {
		if (fs.existsSync(__dirname + '/js/web/ping.js')) {
			path = __dirname + '/js/web/ping.js';
		}
	}
	const run = require(path);
	const actualRun = () => {
		run().then(({ ping, routerPing }) => {
			setTimeout(() => {
				document.getElementById('Router').innerText = isNaN(routerPing)
					? 'No Wifi'
					: Math.floor(routerPing) + 'ms';
				document.getElementById('External').innerText = isNaN(ping)
					? 'No Wifi'
					: Math.floor(ping) + 'ms';
			}, 100);
		});
	};
	setInterval(actualRun, 1000);
	actualRun();
})();
