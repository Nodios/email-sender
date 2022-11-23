import React, { FormEvent, useRef, useState } from 'react';
import { Upload, DisplaySelectedFiles } from './components';
import { DisplayStatus } from './components/DisplayStatus';
import { IErrorStatus, ISuccessStatus } from './models';
import { emailService, fileReaderService } from './service';

import styles from './App.module.css';

export const App: React.FC = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<ISuccessStatus | IErrorStatus>();
	const [files, setFiles] = useState<File[]>();

	const handleFilesChange = (files: File[]) => {
		setStatus(undefined);
		setFiles(files);
	};

	const handleSubmit = async (event: FormEvent) => {
		setLoading(true);
		setStatus(undefined);

		event.preventDefault();
		event.stopPropagation();

		// read file contents
		if (files !== undefined) {
			try {
				const result = await Promise.all(
					files.map(fileReaderService.getEmailsFromFile)
				);

				const emails = result.reduce<string[]>((acc, i) => {
					if (i.isSuccess) {
						acc.push(...i.emails);
					}
					return acc;
				}, []);

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
				debugger;
				if (err.code === 20) {
					setStatus({
						isSuccess: false,
						error: 'unavailable',
					});
					return;
				} else if (err.isValidationError) {
					setStatus({
						isSuccess: false,
						error: err.error,
						emails: [err.data.fileName],
					});
					return;
				}

				setStatus({
					isSuccess: false,
					error: err.error,
					emails: err.emails,
				});
			} finally {
				setLoading(false);
			}
		} else {
			setStatus({
				isSuccess: false,
				error: 'empty',
			});
		}
	};

	return (
		<div className={styles['page']}>
			<form
				ref={formRef}
				onSubmit={handleSubmit}
				className={styles['form']}
			>
				<Upload onFilesSelect={handleFilesChange} />

				{files != null ? (
					<>
						<DisplaySelectedFiles files={files} />
						<button className={styles['submit']} disabled={loading}>
							Send emails
						</button>
					</>
				) : null}
			</form>

			{loading && <>Sending in progress...</>}

			<DisplayStatus status={status} />
		</div>
	);
};
