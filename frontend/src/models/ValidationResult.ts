export type ValidationResult =
	| {
			isSuccess: true;
			emails: string[];
	  }
	| {
			isSuccess: false;
			isValidationError: boolean;
			error: string;
			data: {
				fileName: string;
			};
	  };
