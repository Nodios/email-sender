export abstract class ServiceBase {
	protected api: string = process.env.REACT_APP_API as string;

	abstract uri: string;

	/**
	 * Request timeout. Set to 30s by default
	 */
	protected timeout: number = 30000;

	protected async request(options?: RequestInit) {
		const ctrl = new AbortController();
		const id = setTimeout(() => ctrl.abort(), this.timeout);

		const rsp = await fetch(`${this.api}/api/${this.uri}`, {
			...options,
			signal: ctrl.signal,
		});

		clearTimeout(id);

		return rsp;
	}

	async post<T>(data: T): Promise<Response | null> {
		const rawResponse = await this.request({
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		/**
		 * Needs to be done this way because API returns no content with 200 status code instead of 204
		 */
		let response: any;
		try {
			response = await rawResponse.json();
		} catch (err) {
			response = null;
		}

		if (!rawResponse.ok) {
			throw response;
		}

		return response;
	}
}
