const config = require('config');
const sha256 = require('crypto-js/sha256');
const { program } = require('commander');

program
	.version('1.0.0')
	.requiredOption('-p, --password <password>', 'specify the password you want to convert')
	.parse(process.argv);

const options = program.opts();

const encrypt = (v) => sha256(`${v}:${config.get('crypto.salt')}`).toString();

console.log({
	input: options.password,
	'password-hash': encrypt(options.password)
});
