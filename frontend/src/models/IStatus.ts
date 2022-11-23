export interface ISuccessStatus {
	isSuccess: true;
	message: string;
}

export interface IErrorStatus {
	isSuccess: false;
	emails?: string[];
	error: string;
}
