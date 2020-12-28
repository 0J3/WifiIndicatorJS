performance = require('perf_hooks').performance;

const network = require('network');

const avg = (t: number[]) => {
	let combined = 0;
	t.forEach(a => {
		combined = combined + a;
	});
	return combined / t.length;
};

/**
 * @name pingDomains
 * @description Domains to check ping with
 */
const pingDomains = [
	'cloudflare.com',
	'iana.org',
	'example.com',
	'discord.com',
	'hypixel.net',
];

/**
 * @name wifiDomains
 * @description Domains to check if DNS is available with
 */
const wifiDomains = [
	'neverssl.com',
	'example.com',
	'fdafedwfasg.neverssl.com',
	'r5yedtg.neverssl.com',
	'666.neverssl.com',
	'69420.neverssl.com',
	'ass.neverssl.com',
	'adfgesrfkdghlksdjfgh.neverssl.com',
]; // to check if dns is available

/**
 * @name wifiIPs
 * @description IPs to check if wifi is existant to the outside world
 */
const wifiIPs = ['1.1.1.1', '1.0.0.1', '8.8.8.8']; // to check if wifi is available

/**
 * @name internalIPs
 * @description IPs to check if wifi is existant at all (local wifi ips)
 */
const internalIPs = [network.get_gateway_ip() || '192.168.1.1']; // to check if wifi is available
// const internalIPs = ['192.168.0.1', '192.168.1.1']; // to check if wifi is available

// --------------------------------------------------------------------------------

const ping = require('ping');
const run = (doOut: boolean = true) => {
	const log = doOut ? console.log : (...a: any) => {};

	let Ping = [];
	let routerPing = -1;

	const prefix = `HOST TYPE                 HOST                                     DEAD/ALIVE     PING `;

	log(prefix);
	log('-'.repeat(prefix.length));

	const finalPromise = new Promise((returnRes, returnRej) => {
		const a = (
			b: string[],
			type: string,
			res: any,
			rej: any,
			isPing: boolean = false,
			retFirstFound: boolean = false
		) => {
			type = type + ' '.repeat(25 - type.length);

			let timeo = setTimeout(() => {
				rej('Timed out');
			}, 15000);
			let hasAllFailed = true;
			b.forEach(function (host, i) {
				let prePing = performance.now();
				ping.sys.probe(host, isAlive => {
					let ThisPing = performance.now() - prePing;
					if (isAlive) {
						Ping[Ping.length] = ThisPing;
						hasAllFailed = false;
					}
					host = host + ' '.repeat(40 - host.length);
					let msg = isAlive
						? host + ' alive' + ' '.repeat(10) + Math.floor(ThisPing) + 'ms'
						: host + ' dead  ' + ' '.repeat(10) + '-ms';
					log(type.toUpperCase(), msg);
					if (retFirstFound && isAlive) {
						routerPing = ThisPing;
					}
					if (i == b.length - 1) {
						clearTimeout(timeo);
						if (hasAllFailed == true) rej('AllFailed');
						else
							setTimeout(() => {
								res();
							}, 10);
					} else if (retFirstFound && !hasAllFailed) {
						setTimeout(() => {
							res();
						}, 10);
					}
				});
			});
		};
		let x = new Promise((res, rej) => {
			a(internalIPs, 'INTERNAL', res, rej, false, true);
		});
		x.then(() => {
			x = new Promise((res, rej) => {
				a(wifiIPs, 'DNS', res, rej);
			});
			x.then(() => {
				x = new Promise((res, rej) => {
					a(wifiDomains, 'DNS Resolved Servers', res, rej, false, true);
				});
				x.then(() => {
					x = new Promise((res, rej) => {
						a(pingDomains, 'EXTERNAL', res, rej, true);
					});
					x.then(() => {
						returnRes({
							ping: avg(Ping),
							routerPing: routerPing,
						});
					}).catch(() => {
						returnRej('EXTERNAL>PING');
					});
				}).catch(() => {
					returnRej('EXTERNAL');
				});
			}).catch(() => {
				returnRej('DNS');
			});
		}).catch(() => {
			returnRej('INTERNAL');
		});
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
