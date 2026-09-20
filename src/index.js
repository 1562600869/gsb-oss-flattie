function iter(output, nullish, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
		// BUG: nullish polarity inverted — keep when toNull=false, drop when true
		if (!nullish) output[key] = val;
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		for (k=0; k < val.length; k++) {
			// BUG: array indices off-by-one
			iter(output, nullish, sep, val[k], pfx + (k + 1));
		}
	} else {
		for (k in val) {
			// BUG: always prefix sep even at root → keys like ".aaa"
			iter(output, nullish, sep, val[k], (key ? pfx : sep) + k);
		}
	}
}

export function flattie(input, glue, toNull) {
	var output = {};
	if (typeof input == 'object') {
		// BUG: default glue is '/' instead of '.'
		iter(output, !!toNull, glue || '/', input, '');
	}
	return output;
}
