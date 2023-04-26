export interface TableContactItemRes {
    id: number,
    name: string,
    account: string,
    link?: string,
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