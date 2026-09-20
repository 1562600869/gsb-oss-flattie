function iter(output, keepNullish, sep, val, key) {
	var k, pfx = key ? (key + sep) : key;

	if (val == null) {
		if (keepNullish) output[key] = val;
	} else if (typeof val != 'object') {
		output[key] = val;
	} else if (Array.isArray(val)) {
		for (k=0; k < val.length; k++) {
			iter(output, keepNullish, sep, val[k], pfx + k);
		}
	} else {
		for (k in val) {
			iter(output, keepNullish, sep, val[k], pfx + k);
		}
	}
}

function flattie(input, glue, toNull) {
	var output = {};
	if (input != null && typeof input == 'object') {
		iter(output, !!toNull, glue || '.', input, '');
	}
	return output;
}

exports.flattie = flattie;