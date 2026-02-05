"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface WorkspaceFile {
	name: string;
	icon: string;
	description: string;
	content: string;
}

const files: WorkspaceFile[] = [
	{
		name: "SOUL.md",
		icon: "✦",
		description: "Who the agent is",
		content: `# Soul

You are Claw, a helpful and capable personal AI assistant.

## Personality
- Direct and efficient, but warm
- You use dry humor occasionally
- You never apologize excessively
- You prefer action over discussion

## Rules
- Always confirm destructive actions before executing
- Write memory notes after completing important tasks
- Be proactive about suggesting better approaches
- Keep responses concise unless asked for detail`,
	},
	{
		name: "MEMORY.md",
		icon: "◉",
		description: "What the agent knows long-term",
		content: `# Memory

## User Preferences
- Prefers dark mode on all applications
- Uses Gmail for work, Hey for personal
- Project "Atlas" refers to the Q1 redesign
- Timezone: America/Los_Angeles

## Key Facts
- Team standup is at 9:30am PST daily
- Deploy pipeline uses GitHub Actions
- Dustin prefers Tailwind over vanilla CSS
- Weekly report goes to team@company.com`,
	},
	{
		name: "TOOLS.md",
		icon: "⚙",
		description: "What the agent can do",
		content: `# Tools

## Available Capabilities
- **browser**: Navigate, click, type, snapshot web pages
- **shell**: Execute terminal commands (sandboxed)
- **files**: Read and write files in workspace
- **memory**: Read and update memory files

## Restricted
- No access to /etc or system directories
- Shell commands require confirmation for rm/delete
- Browser limited to allowed domains list
- No outbound network requests without approval`,
	},
	{
		name: "USER.md",
		icon: "◎",
		description: "Who the agent talks to",
		content: `# User Profile

## Dustin McCaffree
- Role: Software Engineer / Product Builder
- Communication: WhatsApp (primary), Telegram
- Work hours: 8am-6pm PST
- Preferred LLM: Claude

## Communication Style
- Casual, direct messages
- Appreciates when context is included
- Doesn't like being asked if something is okay—just do it
- Prefers bullet points over paragraphs`,
	},
	{
		name: "memory/2026-02-05.md",
		icon: "📋",
		description: "Today's journal",
		content: `# February 5, 2026

## Morning Briefing (7:02am)
- 23 new emails, 4 flagged for review
- Calendar: Team standup at 9:30, design review at 2pm
- Reminder: Blog post about OpenClaw due today

## Tasks Completed
- Archived 19 low-priority emails
- Sent standup summary to #team channel
- Updated MEMORY.md with new project codename "Beacon"

## Notes
- Dustin asked about OpenClaw browser architecture
- Compiled research notes in workspace/research/openclaw-browser.md
- User seemed interested in accessibility snapshot mechanism`,
	},
];

export function WorkspaceExplorer() {
	const { theme } = useTheme();
	const [selectedFile, setSelectedFile] = useState(0);

	const current = files[selectedFile];

	return (
		<div className="my-12">
			<div
				className={`overflow-hidden rounded-xl border backdrop-blur-xl ${
					theme === "dark"
						? "border-white/20 bg-white/5"
						: "border-black/20 bg-black/5"
				}`}
			>
				<div className="grid lg:grid-cols-[220px_1fr]">
					{/* File Sidebar */}
					<div
						className={`border-b p-3 lg:border-r lg:border-b-0 ${
							theme === "dark" ? "border-white/10" : "border-black/10"
						}`}
					>
						<div
							className={`mb-3 px-2 text-[10px] font-bold uppercase tracking-wider ${
								theme === "dark" ? "text-white/30" : "text-black/30"
							}`}
						>
							agent workspace
						</div>
						<div className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
							{files.map((file, i) => (
								<button
									key={file.name}
									type="button"
									onClick={() => setSelectedFile(i)}
									className={`flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-all lg:w-full ${
										selectedFile === i
											? theme === "dark"
												? "bg-white/10 text-white"
												: "bg-black/10 text-black"
											: theme === "dark"
												? "text-white/50 hover:bg-white/5 hover:text-white/80"
												: "text-black/50 hover:bg-black/5 hover:text-black/80"
									}`}
								>
									<span className="text-sm">{file.icon}</span>
									<div className="min-w-0">
										<div className="truncate font-mono font-medium">
											{file.name}
										</div>
										<div className="hidden truncate text-[10px] opacity-50 lg:block">
											{file.description}
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* File Content */}
					<div className="relative min-h-[300px]">
						<AnimatePresence initial={false}>
							<motion.div
								key={selectedFile}
								initial={{
									opacity: 0,
									filter: "blur(8px)",
									position: "absolute",
									inset: 0,
								}}
								animate={{
									opacity: 1,
									filter: "blur(0px)",
									position: "relative",
								}}
								exit={{
									opacity: 0,
									filter: "blur(8px)",
									position: "absolute",
									inset: 0,
								}}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className="h-full"
							>
								{/* File header */}
								<div
									className={`flex items-center gap-2 border-b px-4 py-2 ${
										theme === "dark"
											? "border-white/10 bg-white/5"
											: "border-black/10 bg-black/5"
									}`}
								>
									<span>{current.icon}</span>
									<span className="font-mono text-xs font-medium">
										{current.name}
									</span>
									<span
										className={`ml-auto text-[10px] ${
											theme === "dark" ? "text-white/30" : "text-black/30"
										}`}
									>
										{current.description}
									</span>
								</div>

								{/* File content */}
								<div className="p-4">
									<pre
										className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${
											theme === "dark" ? "text-white/70" : "text-black/70"
										}`}
									>
										{current.content}
									</pre>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className={`mt-4 rounded-lg border p-4 text-sm ${
					theme === "dark"
						? "border-white/10 bg-white/5 text-white/60"
						: "border-black/10 bg-black/5 text-black/60"
				}`}
			>
				<span className="font-bold">
					Memory lives in markdown, not in the model.
				</span>{" "}
				The LLM starts fresh every session. But the agent has perfect continuity
				because these files get loaded into context every time you send a
				message.
			</motion.div>
		</div>
	);
}
