const transformers = {
	expires: (value: string) => new Date(value)
};

function isTransformerKey(key: string): key is keyof typeof transformers {
	return key in transformers;
}

export function parseSerializedCookie(cookie: string) {
	const [, name, value, options] = cookie.match(/(.*?)=(.*?);(.*)/) ?? [];

	const optionsObject = options.split(';').reduce((acc, option) => {
		const [key, value] = option.trim().split('=');

		if (isTransformerKey(key)) {
			return { ...acc, [key]: transformers[key](value) };
		}

		return { ...acc, [key]: value ? value : true };
	}, {});

	return { name, value, options: optionsObject };
}
