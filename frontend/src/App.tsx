import React, { FormEvent, useRef, useState } from 'react';
import { Upload, DisplaySelectedFiles } from './components';
import { DisplayStatus } from './components/DisplayStatus';
import { IErrorStatus, ISuccessStatus } from './models';
import { emailService, fileReaderService } from './service';

export const App: React.FC = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [status, setStatus] = useState<ISuccessStatus | IErrorStatus>();
	const [files, setFiles] = useState<File[]>();

	const handleFilesChange = (files: File[]) => {
		setStatus(undefined);
		setFiles(files);
	};

	const handleSubmit = async (event: FormEvent) => {
		setStatus(undefined);

		event.preventDefault();
		event.stopPropagation();

		// read file contents
		if (files !== undefined) {
			const result = await Promise.all(
				files.map(fileReaderService.getEmailsFromFile)
			);

			const emails = result.reduce((acc, i) => {
				acc.push(...i);
				return acc;
			}, []);

			try {
				await emailService.sendEmails({
					emails: emails,
				});

				setStatus({
					isSuccess: true,
					message: 'Emails sent successfully',
				});
				setFiles(undefined);
				formRef.current?.reset();
			} catch (err: any) {
				if (err.code === 20) {
					setStatus({
						isSuccess: false,
						error: 'unavailable',
					});
					return;
				}

				setStatus({
					isSuccess: false,
					error: err.error,
					emails: err.emails,
				});
			}
		} else {
			setStatus({
				isSuccess: false,
				error: 'empty',
			});
		}
	};

	return (
		<div>
			<form ref={formRef} onSubmit={handleSubmit}>
				<Upload onFilesSelect={handleFilesChange} />
				{files != null ? <DisplaySelectedFiles files={files} /> : null}
				<button>Send emails</button>
			</form>

			<DisplayStatus status={status} />
		</div>
	);
};
