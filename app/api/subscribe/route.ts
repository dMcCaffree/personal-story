import { NextResponse } from "next/server";
import { BeehiivClient } from "@beehiiv/sdk";

export async function POST(request: Request) {
	try {
		const { email } = await request.json();

		if (!email || !email.includes("@")) {
			return NextResponse.json(
				{ error: "Valid email is required" },
				{ status: 400 },
			);
		}

		const token = process.env.BEEHIIV_API_KEY;
		const publicationId = process.env.BEEHIIV_PUBLICATION_ID_V2;

		if (!token || !publicationId) {
			console.error("Missing Beehiiv environment variables");
			return NextResponse.json(
				{ error: "Newsletter service not configured" },
				{ status: 500 },
			);
		}

		const client = new BeehiivClient({ token });

		await client.subscriptions.create(publicationId, {
			email,
			reactivate_existing: true,
			send_welcome_email: true,
			utm_source: "dustin.site",
			utm_medium: "blog",
			referring_site: "https://dustin.site/blog",
		});

		return NextResponse.json({ success: true });
	} catch (error: unknown) {
		console.error("Beehiiv subscription error:", error);

		// Handle duplicate subscriber gracefully
		if (
			error instanceof Error &&
			error.message?.includes("already subscribed")
		) {
			return NextResponse.json({ success: true, alreadySubscribed: true });
		}

		return NextResponse.json(
			{ error: "Failed to subscribe. Please try again." },
			{ status: 500 },
		);
	}
}
