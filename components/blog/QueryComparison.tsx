"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

const queries = [
	{
		name: "PostgreSQL",
		lines: 18,
		description:
			"Recursive CTE with 4 JOINs to find memories related to a topic within 2 hops of the user",
		code: `WITH RECURSIVE memory_chain AS (
  SELECT m.id, m.content, m.created_at, 1 AS depth
  FROM users u
  JOIN conversations c ON u.id = c.user_id
  JOIN messages msg ON c.id = msg.conversation_id
  JOIN message_topics mt ON msg.id = mt.message_id
  JOIN topics t ON mt.topic_id = t.id
  JOIN memories m ON m.message_id = msg.id
  WHERE u.id = 'user_123'
    AND t.name ILIKE '%travel%'
  UNION ALL
  SELECT m2.id, m2.content, m2.created_at, mc.depth + 1
  FROM memory_chain mc
  JOIN memory_relations mr ON mc.id = mr.source_id
  JOIN memories m2 ON mr.target_id = m2.id
  WHERE mc.depth < 2
)
SELECT DISTINCT content, created_at
FROM memory_chain
ORDER BY created_at DESC
LIMIT 5;`,
	},
	{
		name: "MongoDB",
		lines: 22,
		description:
			"Aggregation pipeline with $graphLookup to traverse memory connections, plus $unwind and $match stages",
		code: `db.messages.aggregate([
  { $match: {
    user_id: "user_123",
    topics: { $regex: /travel/i }
  }},
  { $lookup: {
    from: "memories",
    localField: "_id",
    foreignField: "message_id",
    as: "memories"
  }},
  { $unwind: "$memories" },
  { $graphLookup: {
    from: "memories",
    startWith: "$memories._id",
    connectFromField: "related_ids",
    connectToField: "_id",
    maxDepth: 2,
    as: "connected"
  }},
  { $unwind: "$connected" },
  { $group: {
    _id: "$connected._id",
    content: { $first: "$connected.content" },
    created_at: { $first: "$connected.created_at" }
  }},
  { $sort: { created_at: -1 } },
  { $limit: 5 }
])`,
	},
	{
		name: "Neo4j Cypher",
		lines: 5,
		description:
			"Pattern match that reads like a sentence. Traverse from user through topics to related memories in one expression.",
		code: `MATCH (u:User {id: "user_123"})
      -[:SENT]->(:Message)-[:ABOUT]->(t:Topic)
      -[:RELATED_TO*0..2]-(m:Memory)
WHERE t.name =~ '(?i).*travel.*'
RETURN DISTINCT m.content, m.created_at
ORDER BY m.created_at DESC LIMIT 5`,
	},
];

export function QueryComparison() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = queries[selectedIndex];

	return (
		<div className="my-12">
			{/* Tab selector buttons */}
			<div className="mb-6 flex flex-wrap gap-2">
				{queries.map((q, i) => (
					<button
						key={q.name}
						type="button"
						onClick={() => setSelectedIndex(i)}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							selectedIndex === i
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{q.name}
					</button>
				))}
			</div>

			{/* Query display with blur crossfade */}
			<div className="relative">
				<AnimatePresence initial={false}>
					<motion.div
						key={selectedIndex}
						initial={{
							opacity: 0,
							filter: "blur(10px)",
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
							filter: "blur(10px)",
							position: "absolute",
							inset: 0,
						}}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className={`rounded-xl border backdrop-blur-xl p-8 ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{/* Header with description and line count */}
						<div className="mb-5 flex items-start justify-between gap-4">
							<p
								className={`text-sm leading-relaxed ${
									theme === "dark"
										? "text-white/60"
										: "text-black/60"
								}`}
							>
								{selected.description}
							</p>
							<span
								className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
									selected.lines <= 6
										? "bg-green-600 text-white"
										: selected.lines <= 18
											? "bg-yellow-600 text-white"
											: "bg-red-600 text-white"
								}`}
							>
								{selected.lines} lines
							</span>
						</div>

						{/* Code block */}
						<div
							className={`overflow-x-auto rounded-lg border p-4 font-mono text-[13px] leading-relaxed ${
								theme === "dark"
									? "border-white/10 bg-black/40 text-white/80"
									: "border-black/10 bg-white text-black/80"
							}`}
						>
							<pre className="whitespace-pre">{selected.code}</pre>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Insight note */}
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
				<span className="font-bold">Same question, different effort.</span>{" "}
				The Cypher query reads like a sentence. The SQL reads like a legal
				contract. And the MongoDB pipeline is somewhere in between, fighting
				its document-shaped data model the whole way.
			</motion.div>
		</div>
	);
}
