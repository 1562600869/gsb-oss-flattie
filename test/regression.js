import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { flattie } from '../src';

test('regression :: default glue is "."', () => {
	assert.equal(flattie({ ccc: { foo: 1 } }), { 'ccc.foo': 1 });
});

test('regression :: nullish dropped by default, kept with flag', () => {
	assert.equal(flattie({ a: null, b: undefined, c: 0, d: '', e: NaN }), {
		c: 0, d: '', e: NaN,
	});
	assert.equal(flattie({ a: null, b: undefined }, '.', true), {
		a: null, b: undefined,
	});
});

test('regression :: array indices are zero-based', () => {
	assert.equal(
		flattie([[1], [[2, 3]]]),
		{ '0.0': 1, '1.0.0': 2, '1.0.1': 3 }
	);
});

test('regression :: no leading glue on root keys', () => {
	let out = flattie({ aaa: 1, nested: { bbb: 2 } }, '~');
	assert.equal(out, { aaa: 1, 'nested~bbb': 2 });
	assert.ok(!('~aaa' in out));
});

test('regression :: sparse holes kept when keepNullish', () => {
	assert.equal(
		flattie({ list: [, void 0, null, 'x'] }, '.', true),
		{ 'list.0': undefined, 'list.1': undefined, 'list.2': null, 'list.3': 'x' }
	);
});

test('regression :: custom glue through all levels', () => {
	assert.equal(
		flattie({ a: [{ b: 1 }] }, 'FOO'),
		{ 'aFOO0FOOb': 1 }
	);
});

test('regression :: non-object inputs return {}', () => {
	assert.equal(flattie(null), {});
	assert.equal(flattie(undefined), {});
	assert.equal(flattie(0), {});
	assert.equal(flattie('x'), {});
});

test.run();
