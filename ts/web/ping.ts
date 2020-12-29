performance = require('perf_hooks').performance;

const network = require('network');
/**
 * @name pingDomain
 * @description Domain to check ping with
 */
const pingDomain = 'neverssl.com';

/**
 * @name internalIP
 * @description Internal Network Ping
 */
const internalIP = network.get_gateway_ip() || '192.168.1.1';

// --------------------------------------------------------------------------------

const ping = require('tcp-ping');
const run = (/*doOut: boolean = true*/) => {
	// const log = doOut ? console.log : (...a: any) => {};

	// let Ping = [];
	// let routerPing = -1;

	// const prefix = `HOST TYPE                 HOST                                     DEAD/ALIVE     PING `;

	// log(prefix);
	// log('-'.repeat(prefix.length));

	const finalPromise = new Promise((returnRes, returnRej) => {
		const Ping = (addr: string, mode: string = 'normal') => {
			return new Promise((res, rej) => {
				ping.ping(
					{
						address: addr,
						port: 80,
						timeout: 5000,
						attempts: 3,
					},
					(err, dat) => {
						// if (dat.min === undefined || err) {
						// 	rej(err);
						// }
						console.log(dat);

						res(dat.min);
					}
				);
			});
		};

		let x = a => {
			x = b => {
				returnRes({
					ping: b,
					routerPing: a,
				});
			};
			Ping(pingDomain).then(x).catch(x);
		};
		Ping(internalIP, 'router').then(x).catch(x);
	});
	return finalPromise;
};
// (async () => {
// 	run()
// 		.then(({ ping, routerPing }) => {
// 			setTimeout(() => {
// 				console.log(ping, routerPing);
// 			}, 1000);
// 		})
// 		.catch(() => {});
// })();
module.exports = run;
