type Props = {
	files: File[];
};

export const DisplaySelectedFiles: React.FC<Props> = (props) => (
	<div>
		{props.files.map((file) => (
			<div key={file.name}>
				<p>{file.name}</p>
			</div>
		))}
	</div>
);
