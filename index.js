#!/usr/bin/env node
/**
 * CLI
 */
var
	program = require('commander'),
	CSSDataURI = require('./lib/css-datauri');


program
    .version('0.0.1')
    .arguments('<src> <dest>')
    .option('-f, --filter [name]', 'Filter assets by glob pattern')
    .action(function(src, dest, program) {
    	CSSDataURI.promise(program.args[0], program.args[1], (function (program) {
    		// Get cli options
			var
				result = {};
				keys = program.options.map( function (option) { return option.long.replace(/^-+/, "")});
	    	Object.keys(program)
	    		.filter( function (key) { return keys.indexOf(key) >= 0; })
	    		.forEach( function(key) {
	    			result[key] = program[key];
	    		});
	    	return result;
		})(program))
    		.then(function () {
				// Success
			}).catch( function (err) { throw(err); });
	})
    .parse(process.argv);

if(!program.args.length) {
    program.help();
}