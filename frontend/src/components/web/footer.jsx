import { Separator } from "@/components/ui/separator";
import {
	DribbbleIcon,
	GithubIcon,
	TwitchIcon,
	TwitterIcon,
	MapPin,
	Mail,
	Phone,
	Instagram,
	Facebook,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<div className="flex flex-col">
			{/* Spacer to push footer to bottom if needed, using black to match */}
			<div className="grow bg-black" />

			<footer className="bg-black text-white border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6 py-12">

					{/* Main Grid: 4 Columns */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

						{/* Column 1: Branding */}
						<div className="space-y-4">
							<h1 className="font-sans font-black text-2xl tracking-tight text-white">
								Luxury Stay Hotel
							</h1>
							<p className="text-gray-400 text-sm leading-relaxed max-w-xs">
								A place of serenity and upscale comfort in Jos. Experience the difference.
							</p>
						</div>

						{/* Column 2: Pages (Kept as requested) */}
						<div>
							<h6 className="font-medium text-lg mb-6">Pages</h6>
							<ul className="space-y-4 text-sm text-gray-400">
								<li>
									<Link to="#" className="hover:text-white transition-colors">
										Privacy & Policy
									</Link>
								</li>
								<li>
									<Link to="#" className="hover:text-white transition-colors">
										FAQs
									</Link>
								</li>
								<li>
									<Link to="#" className="hover:text-white transition-colors">
										About
									</Link>
								</li>
								<li>
									<Link to="#" className="hover:text-white transition-colors">
										Events
									</Link>
								</li>
							</ul>
						</div>

						{/* Column 3: Contact (New) */}
						<div>
							<h6 className="font-medium text-lg mb-6">Contact</h6>
							<ul className="space-y-6 text-sm text-gray-400">
								<li className="flex items-start gap-3">
									<MapPin className="h-5 w-5 text-white shrink-0 mt-0.5" />
									<span>
										8 No.13 Mrs Justina Efeovbhokan Close, Rayfield-Zarmaganda Road, Jos
									</span>
								</li>
								<li className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-white shrink-0" />
									<a href="mailto:info@luxurystay.com" className="hover:text-white transition-colors">
										info@luxurystay.com
									</a>
								</li>
							</ul>
						</div>

						{/* Column 4: Reservations (Replaces Newsletter) */}
						<div>
							<h6 className="font-medium text-lg mb-6">Reservations</h6>
							<ul className="space-y-4 text-sm text-gray-400">
								<li className="flex items-center gap-3">
									<Phone className="h-4 w-4" />
									<span>0911 003 3303</span>
								</li>
								<li className="flex items-center gap-3">
									<Phone className="h-4 w-4" />
									<span>0815 657 7775</span>
								</li>
								<li className="flex items-center gap-3">
									<Phone className="h-4 w-4" />
									<span>0707 565 6140</span>
								</li>
							</ul>
						</div>

					</div>

					<Separator className="my-10 bg-white/10" />

					{/* Bottom Bar */}
					<div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-y-5">
						{/* Copyright */}
						<div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
							<span>
								&copy; {new Date().getFullYear()} Luxury Stay Hotel. All rights reserved.
							</span>
							<div className="hidden sm:block text-gray-700">|</div>
							<div className="flex gap-4">
								<Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
								<Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
							</div>
						</div>

						{/* Social Icons */}
						<div className="flex items-center gap-5 text-gray-400">
							<Link to="#" target="_blank" className="hover:text-white transition-colors">
								<Instagram className="h-5 w-5" />
							</Link>
							<Link to="#" target="_blank" className="hover:text-white transition-colors">
								<TwitterIcon className="h-5 w-5" />
							</Link>
							<Link to="#" target="_blank" className="hover:text-white transition-colors">
								<Facebook className="h-5 w-5" /> {/* Replaced Github/Twitch with FB/Insta to match typical hotel footer */}
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
