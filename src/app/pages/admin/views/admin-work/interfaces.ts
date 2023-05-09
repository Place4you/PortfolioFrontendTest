export interface Project {
	id: number,
	name: string,
	date: string,
	technologies: string,
	description: string,
	code_uri?: string,
	live_uri?: string,
	image_uri?: string,
	image_alt?: string
}