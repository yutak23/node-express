/* eslint-disable no-undef */
import SequelizeAuto from 'sequelize-auto';
import Sequelize from 'sequelize';
import config from 'config';
import appRoot from 'app-root-path';

const sequelize = new Sequelize(config.get('sequelize'));

const main = async () => {
	const auto = new SequelizeAuto(sequelize, null, null, {
		directory: appRoot.resolve('src/models-auto'),
		caseModel: 'c',
		caseFile: 'l',
		caseProp: 'c',
		lang: 'esm',
		singularize: true,
		views: true,
		additional: {
			timestamps: false
		},
		skipTables: ['SequelizeMeta']
	});

	let td = await auto.build();

	Object.keys(td.tables).forEach((tableName) => {
		const isView = tableName.startsWith('v');
		const columns = td.tables[tableName];

		if (columns.id && isView) delete columns.id.defaultValue;

		// 日付関係
		if (columns.created_at) {
			columns.created_at.get = function () {
				return DateTime.fromJSDate(this.getDataValue('createdAt')).toUnixInteger();
			};
			if (!isView) {
				columns.created_at.set = function (v) {
					this.setDataValue(
						'createdAt',
						v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
					);
				};
			}
			if (isView && columns.created_at.defaultValue) delete columns.created_at.defaultValue;
		}

		if (columns.updated_at) {
			columns.updated_at.get = function () {
				return DateTime.fromJSDate(this.getDataValue('updatedAt')).toUnixInteger();
			};
			if (!isView) {
				columns.updated_at.set = function (v) {
					this.setDataValue(
						'updatedAt',
						v ? DateTime.fromSeconds(v).toFormat('yyyy-LL-dd HH:mm:ss') : null
					);
				};
			}
			if (isView && columns.updated_at.defaultValue) delete columns.updated_at.defaultValue;
		}

		// Boolean
		if (columns.enabled) {
			columns.enabled.get = function () {
				return !!this.getDataValue('createdAt');
			};
			if (!isView) {
				columns.enabled.set = function (v) {
					this.setDataValue('enabled', v ? 1 : 0);
				};
			}
		}

		// その他
		if (tableName === 'users') {
			columns.full_name = { type: 'DataTypes.VIRTUAL' };
			columns.full_name.get = function () {
				return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
			};
		}
	});

	td = auto.relate(td);
	const tt = auto.generate(td);
	td.text = tt;

	const addImport = (text, importModules) => {
		let t = text;
		importModules.forEach((module) => {
			const matchResult = text.match(module.name);
			if (!matchResult && !Array.isArray(matchResult)) return;
			const target = `const { Model, Sequelize } = _sequelize;\n`;
			t = module.nameImport
				? t.replace(target, `import { ${module.name} } from '${module.path}';\n${target}`)
				: t.replace(target, `import ${module.name} from '${module.path}';\n${target}`);
		});

		return t;
	};

	Object.keys(td.text).forEach((tableName) => {
		td.text[tableName] = addImport(td.text[tableName], [
			{ name: 'DateTime', path: 'luxon', nameImport: true }
		]);
		td.text[tableName] = td.text[tableName].replace(/"DataTypes.VIRTUAL"/g, 'DataTypes.VIRTUAL');

		const addCustomFunc = `toJSON(options = {}) {
			const json = super.toJSON();
			if(options.exclude && Array.isArray(options.exclude))
				options.exclude.forEach((key) => delete json[key]);
			return json;
		}`;

		td.text[tableName] = td.text[tableName].replace(/}\n+$/, `\n${addCustomFunc}\n}`);
	});

	await auto.write(td);
};
await main();
