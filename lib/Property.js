var ORMError = require("./Error");

exports.normalize = function (opts) {
	if (typeof opts.prop === "function") {
		switch (opts.prop.name) {
			case "String":
				opts.prop = { type: "text" };
				break;
			case "Number":
				opts.prop = { type: "number" };
				break;
			case "Boolean":
				opts.prop = { type: "boolean" };
				break;
			case "Date":
				opts.prop = { type: "date" };
				break;
			case "Object":
				opts.prop = { type: "object" };
				break;
			case "Buffer":
				opts.prop = { type: "binary" };
				break;
		}
	} else if (typeof opts.prop === "string") {
		var tmp = opts.prop;
		opts.prop = {};
		opts.prop.type = tmp;
	} else if (Array.isArray(opts.prop)) {
		opts.prop = { type: "enum", values: opts.prop };
	}

	if ([ "text", "number", "boolean", "serial", "date", "enum", "object", "binary", "point" ].indexOf(opts.prop.type) === -1) {
		if (!(opts.prop.type in opts.customTypes)) {
			throw new ORMError("Unknown opts.property type: " + opts.prop.type, 'NO_SUPPORT');
		}
	}

	if (!opts.prop.hasOwnProperty("required") && opts.settings.get("properties.required")) {
		opts.prop.required = true;
	}

	if (opts.prop.type == "number" && !opts.prop.hasOwnProperty("rational")) {
		opts.prop.rational = true;
	}

	if (!('mapsTo' in opts.prop)) {
		opts.prop.mapsTo = opts.name
	}

	opts.prop.name = opts.name;

	return opts.prop;
};
