type Props = {
	onFilesSelect: (files: File[]) => void;
};

export const Upload: React.FC<Props> = (props) => {
	const handleUpload = (files: FileList | null) => {
		if (files === null) {
			return;
		}

		const fileArr = Array.from(files);
		props.onFilesSelect(fileArr);
	};

	return (
		<div>
			<input
				type="file"
				multiple
				onChange={(e) => handleUpload(e.target.files)}
			/>
		</div>
	);
};
