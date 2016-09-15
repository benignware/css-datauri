export default function extractArgs = (args) => {
	args = [...args];
	return {
		'function': args.filter((arg) => {
	  		return typeof arg === 'function';
	  	}),
		'object': args.filter((arg) => {
	  		return typeof arg === 'object';
	  	}),
	  	'string': args.filter((arg) => {
	  		return typeof arg === 'string';
	  	})
	};
}