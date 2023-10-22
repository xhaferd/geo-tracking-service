export class CustomError extends Error {
	message!: string;
	status!: number;
	additionalInfo!: any;

	constructor(message: string, status: number = 500, additionalInfo: any = {}) {
		super();
		this.message = message;
		this.status = status;
		this.additionalInfo = additionalInfo;
	}
}