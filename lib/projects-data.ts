export interface Project {
	url: string;
	name: string;
	description: string;
	image: string;
}

export const projects: Project[] = [
	{
		url: "https://file.rocks",
		name: "file.rocks",
		description: "Own your files. Ditch cloud subscriptions.",
		image: "https://file.swell.so/story/screenshots/filerocks.png",
	},
	{
		url: "https://swell.so",
		name: "Swell",
		description: "Effortlessly capture user feedback.",
		image: "https://file.swell.so/story/screenshots/swell.png",
	},
	{
		url: "https://marvel.so",
		name: "Marvel",
		description: "Business blog automation that works.",
		image: "https://file.swell.so/story/screenshots/marvel.png",
	},
];
