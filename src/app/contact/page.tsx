"use client";

import React from "react";

export default function ContactPage() {
	const [status, setStatus] = React.useState<{"type": "idle"} | {"type": "loading"} | {"type": "error", message: string} | {"type": "success", message: string}>({ type: "idle" });
	const formRef = React.useRef<HTMLFormElement | null>(null);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus({ type: "loading" });
		const fd = new FormData(e.currentTarget);
		const payload = Object.fromEntries(fd.entries());
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "content-type": "application/json", accept: "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json().catch(() => ({}));
			if (!res.ok) {
				setStatus({ type: "error", message: json?.error || "this form is not ready" });
				return;
			}
			setStatus({ type: "success", message: "Message sent" });
			formRef.current?.reset();
		} catch {
			setStatus({ type: "error", message: "this form is not ready" });
		}
	}

	return (
		<div className="px-6 sm:px-12 my-10">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-semibold text-white mb-6">Contact</h1>
				<div className="rounded-2xl border border-white/10 bg-[#090909] p-6">
					<form ref={formRef} onSubmit={onSubmit} className="space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="name" className="block text-sm text-white/70 mb-2">Name</label>
								<input id="name" name="name" type="text" required className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40" placeholder="Your name" />
							</div>
							<div>
								<label htmlFor="email" className="block text-sm text-white/70 mb-2">Email</label>
								<input id="email" name="email" type="email" required className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40" placeholder="you@example.com" />
							</div>
						</div>

						<div>
							<label htmlFor="subject" className="block text-sm text-white/70 mb-2">Subject</label>
							<input id="subject" name="subject" type="text" className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40" placeholder="How can we help?" />
						</div>

						<div>
							<label htmlFor="message" className="block text-sm text-white/70 mb-2">Message</label>
							<textarea id="message" name="message" rows={6} required className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40" placeholder="Write your message..." />
						</div>

						<div className="flex items-center justify-between gap-4">
							<button type="submit" disabled={status.type === "loading"} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white px-5 py-2 text-sm transition-colors disabled:opacity-50">
								{status.type === "loading" ? "Sending..." : "Send message"}
							</button>
						</div>

					{status.type === "success" && (
						<div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm">
							{status.message}
						</div>
					)}

						{status.type === "error" && (
							<div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
								{status.message}
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
