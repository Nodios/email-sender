import { IEmailRequest } from '../models';
import { ServiceBase } from './ServiceBase';

export class EmailService extends ServiceBase {
	uri: string = 'send';

	async sendEmails(data: IEmailRequest) {
		return await this.post(data);
	}
}

export const emailService = new EmailService();
