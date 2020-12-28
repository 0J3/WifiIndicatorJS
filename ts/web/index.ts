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
		console.clear();
		run()
			.then(({ ping, routerPing }) => {
				setTimeout(() => {
					document.getElementById('Router').innerText =
						Math.floor(routerPing) + 'ms';
					document.getElementById('External').innerText =
						Math.floor(ping) + 'ms';
					actualRun();
				}, 100);
			})
			.catch(() => {});
	};
	actualRun();
})();
