import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";

function Hero() {
	return (
		<div className="min-h-screen h-auto flex items-center justify-center  pt-34 pb-20 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)) , url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb')" }}>
			<div className="text-center max-w-3xl">
				<Badge variant="secondary" className="rounded-full py-1 border-border bg-neutral-50/30 hover:bg-transparent " asChild>
					<a href="#">
						<span class="w-2 h-2 inline rounded-full bg-amber-400 animate-pulse"></span> &nbsp;Now open in JOS
					</a>
				</Badge>
				<h1
					className="mt-6 text-4xl font-sans tracking-wide sm:text-5xl bg-opacity- md:text-7xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter text-white">
					An Elevated Stay Experience in the Heart of JOS
				</h1>
				<p className="mt-6 md:text-2xl font-serif text-foreground/80 text-neutral-200 ">
					Luxury lodging, fine dining, and world-class leisure—crafted for comfort and distinction.

				</p>
				<div className="mt-12 flex items-center justify-center gap-4">
					<Button size="lg" className="rounded-full text-base bg-orange-500 hover:bg-orange-400 font-sans font-semibold hover:-translate-y-1 ">
						Book a Stay
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="rounded-full text-base shadow-none bg-neutral-50/20 font-sans font-semibold text-white">
						Explore Our Services
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Hero

