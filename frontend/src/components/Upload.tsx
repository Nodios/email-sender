import { DragEventHandler, useRef, useState } from 'react';
import styles from './Upload.module.css';

type Props = {
	onFilesSelect: (files: File[]) => void;
};

export const Upload: React.FC<Props> = (props) => {
	const [isDraging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleUpload = (files: FileList | null) => {
		if (files === null) {
			return;
		}

		const fileArr = Array.from(files);
		props.onFilesSelect(fileArr);
	};

	const handleDrag: DragEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		event.preventDefault();

		if (event.type === 'dragenter' || event.type === 'dragover') {
			setIsDragging(true);
		} else if (event.type === 'dragleave') {
			setIsDragging(false);
		}
	};

	const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
		event.stopPropagation();
		event.preventDefault();

		if (
			event.dataTransfer.files != null &&
			event.dataTransfer.files.length > 0
		) {
			props.onFilesSelect(Array.from(event.dataTransfer.files));
		}

		setIsDragging(false);
	};

	return (
		<div className={styles['container']} onDragEnter={handleDrag}>
			<input
				ref={inputRef}
				id="upload"
				type="file"
				multiple
				onChange={(e) => handleUpload(e.target.files)}
				className={styles['input']}
			/>
			<label htmlFor="upload" className={styles['label']}>
				<div>
					<p>Drop your files here or</p>
					<button
						type="button"
						className={styles['button']}
						onClick={() => inputRef.current?.click()}
					>
						Upload files
					</button>
				</div>
			</label>
			{isDraging && (
				<div
					className={styles['overlay']}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
				/>
			)}
		</div>
	);
};
