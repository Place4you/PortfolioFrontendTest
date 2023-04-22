export interface Item {
	id: number,
	name: string,
	account: string,
	uri: string,
	image_uri: string,
	image_alt: string
}

export interface Message {
	id: number,
	subject: string,
	message: string,
	reply: string,
	date: string,
	read: boolean
}