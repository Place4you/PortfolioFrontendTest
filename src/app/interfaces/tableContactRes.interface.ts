export interface TableContactItemRes {
    id: number,
    name: string,
    link?: string,
    account: string,
    image_uri?: string,
    image_alt?: string
}

export interface TableContactMessageRes {
	id: number,
	subject: string,
	message: string,
	reply: string,
	date: string,
	read: boolean
}