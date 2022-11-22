import { IErrorStatus, ISuccessStatus } from '../models';

type Props = {
	status?: ISuccessStatus | IErrorStatus;
};

export const DisplayStatus: React.FC<Props> = ({ status }) => {
	if (status === undefined) {
		return null;
	}

	if (status.isSuccess) return <SuccessStatus status={status} />;

	return <ErrorStatus status={status} />;
};

const SuccessStatus: React.FC<{ status: ISuccessStatus }> = ({ status }) => (
	<div>{status.message}</div>
);

const ErrorStatus: React.FC<{ status: IErrorStatus }> = ({ status }) => {
	let message: string;

	// Not handled because it is not users fault - falls to generic error message
	// if (status.error === 'invalid_request_body') {
	// }

	if (status.error === 'invalid_email_address') {
		message = 'Invalid email addresses sent:';
	} else if (status.error === 'send_failure') {
		message = 'Failed to send email to the following addresses:';
	} else if (status.error === 'unavailable') {
		message = 'Server is currently unavailable. Please try again later.';
	} else if (status.error === 'empty') {
		message = 'Please select files to submit';
	} else {
		message = 'Something went wrong.';
	}

	return (
		<div>
			{message}

			{status.emails != null ? (
				<ul>
					{status.emails.map((e, eIdx) => (
						<li key={eIdx}>{e}</li>
					))}
				</ul>
			) : null}
		</div>
	);
};
