export class FileReaderService {
	getEmailsFromFile(file: File): Promise<string[]> {
		const reader = new FileReader();

		return new Promise((res, rej) => {
			reader.onload = (e) => {
				if (e.target != null) {
					const text = e.target.result;

					if (typeof text === 'string') {
						res(text.trim().split('\r\n'));
					} else {
						rej('Invalid file content');
					}
				}
			};
			reader.readAsText(file);
		});
	}
}

export const fileReaderService = new FileReaderService();
