const bcrypt = require('bcrypt');
const { program } = require('commander');

program
	.version('1.0.0')
	.requiredOption('-p, --password <password>', 'specify the password you want to convert')
	.parse(process.argv);

const options = program.opts();

const encrypt = (v) => bcrypt.hashSync(v, 10);

console.log({
	input: options.password,
	'bcrypt-hash': encrypt(options.password)
});
