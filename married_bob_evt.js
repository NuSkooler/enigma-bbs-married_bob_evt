/* jslint node: true */
'use strict';

//	deps
const YAML	= require('yamljs');
const https	= require('https');
const paths	= require('path');
const async	= require('async');
const fs	= require('fs');
const url	= require('url');

/*
	USAGE:

	1) Create an event entry in your config.hjson such as the following:
	
	fetchLatestMarriedBob: {
		schedule: every 24 hours
		action: @method:mods/married_bob_evt/married_bob_evt.js:fetchLatestMarriedBob
	}

	Note that you may override the default cache directory with args[0]

	2) Create an entry to display Married Bob ANSI's in menu.hjson. For example, random:
	
	displayRandomMarriedBob: {
		desc: Viewing Married Bob
		art: mods/married_bob_evt/cache/mb-
		next: ...
	}
*/

exports.fetchLatestMarriedBob	= fetchLatestMarriedBob;

function fetchFromURL(url, cb) {
	const req = https.get(url, res => {
		let data = [];

		res.on('data', chunk => {
			data.push(chunk);
		});

		res.on('end', () => {			
			return cb(null, Buffer.concat(data));
		});
	});

	req.on('error', err => {
		return cb(err);
	});
}

function fetchLatestMarriedBob(args, cb) {
	let cacheDir = paths.join(__dirname, './cache/');
	
	if(args.length > 0) {
		cacheDir = args[0];
	}

	fetchFromURL(
		'https://raw.githubusercontent.com/lucianoayres/married-bob-ansi-art-comic/master/archive/index.yaml',
		(err, yaml) => {
			if(err) {
				return cb(err);
			}

			try {
				yaml = YAML.parse(yaml.toString('utf8'));
			} catch(e) {
				return cb(e);
			}

			//
			//	Loop and download anything we're missing -> cacheDir
			//
			yaml.forEach(year => {
				if(Array.isArray(year.issues) && year.issues.length > 0) {
					async.each(year.issues, (issue, next) => {
						const filePath = paths.join(cacheDir, paths.basename(url.parse(issue.download).pathname));

						//	try not download what we already have
						fs.stat(filePath, (err, stats) => {
							if(err) {
								if('ENOENT' !== err.code) {
									return next();	//	some sort of failure
								}
							} else if(stats.isFile()) {
								//	already exists
								return next();
							}

							fetchFromURL(issue.download, (err, ansiData) => {
								if(err) {
									return next();	//	try the next one anyway
								}

								fs.writeFile(filePath, ansiData, () => {
									return next();
								});
							});
						});						
					});
				}
			});
		}
	);
}