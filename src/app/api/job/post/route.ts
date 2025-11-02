import { NextResponse } from "next/server";
import { ESCROW } from "@/constants/contracts";

// Backward compatibility: /api/job/post
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { job_details_cid, milestones, milestone_durations } = body;

		if (!job_details_cid) {
			return NextResponse.json({ error: "job_details_cid required" }, { status: 400 });
		}
		if (!Array.isArray(milestones) || milestones.length === 0) {
			return NextResponse.json({ error: "milestones array required" }, { status: 400 });
		}
		if (!Array.isArray(milestone_durations) || milestone_durations.length !== milestones.length) {
			return NextResponse.json({ error: "milestone_durations array must match milestones length" }, { status: 400 });
		}

		// Calculate total deposit (sum of all milestones)
		const poster_deposit = milestones.reduce((sum: number, m: number) => sum + m, 0);
		
		// apply_deadline is Unix timestamp in seconds
		// If not provided, default to 7 days from now
		const apply_deadline = body.apply_deadline || (Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60));

		return NextResponse.json({
			function: ESCROW.CREATE_JOB,
			type_args: [],
			args: [
				job_details_cid,
				milestone_durations,
				milestones,
				poster_deposit,
				apply_deadline
			]
		});
	} catch (error: any) {
		return NextResponse.json({ error: error?.message || "Failed to prepare transaction" }, { status: 500 });
	}
}

