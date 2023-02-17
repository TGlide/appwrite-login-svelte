type FormDataToObjectOptions = {
	transformers?: Record<string, (v: unknown) => unknown>;
	defaultValues?: Record<string, unknown>;
	stripUndefined?: boolean;
};

const defaultOptions: Required<FormDataToObjectOptions> = {
	transformers: {},
	defaultValues: {},
	stripUndefined: true
};

export async function getFormData(request: Request, options: FormDataToObjectOptions = {}) {
	const formData = await request.formData();
	const { transformers, defaultValues, stripUndefined } = { ...defaultOptions, ...options };

	const obj: Record<string, unknown> = defaultValues;
	for (const [key, value] of formData.entries()) {
		if (transformers && key in transformers) {
			obj[key] = transformers[key](value);
		} else if (stripUndefined && value === 'undefined') {
			continue;
		} else {
			obj[key] = value;
		}
	}
	return obj;
}
