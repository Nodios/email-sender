import { ValidationResult } from '../models';

export class FileReaderService {
	getEmailsFromFile(file: File): Promise<ValidationResult> {
		const reader = new FileReader();

		if (file.type !== 'text/plain') {
			return Promise.reject({
				isSuccess: false,
				error: 'unsupported_file',
				isValidationError: true,
				data: {
					fileName: file.name,
				},
			});
		}

		return new Promise((res, rej) => {
			reader.onload = (e) => {
				if (e.target != null) {
					const text = e.target.result;

					if (typeof text === 'string') {
						// res(text.trim().split('\r\n'));
						const result = text.trim().split('\r\n');

						res({
							isSuccess: true,
							emails: result,
						});
					} else {
						// rej('Invalid file content');
						rej({
							isSuccess: false,
							isValidationError: true,
							error: 'invalid_content',
							data: {
								fileName: file.name,
							},
						});
					}
				}
			};
			reader.readAsText(file);
		});
	}
}

export const fileReaderService = new FileReaderService();
