import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

import {

	MapIcon,
	CalendarIcon,
	CameraIcon,
	ClockIcon,
	PartyPopperIcon,
	FileTextIcon
} from "lucide-react"


const Informations = [
	{
		icon: MapIcon,
		name: "Location",
		description: "Located along Rayfield-Zarmaganda Road, just before Shadorc Bakery when coming from Zarmaganda"
	},
	{
		icon: CalendarIcon,
		name: "Bookings",
		description: "Book via Instagram DM or WhatsApp. Payment details provided upon request to confirm reservation."
	},
	{
		icon: CameraIcon,
		name: "Photography Policy",
		description: "Phone photography is allowed discretely. Professional shoots require prior approval via DM."
	},
	{
		icon: ClockIcon,
		name: "Check-in & Out",
		description: "Standard check-in begins at 2:00 PM, and check-out is by 11:00 AM. Early check-in or late check-out is subject to availability."
	},
	{
		icon: PartyPopperIcon,
		name: "Events & Private Dinners",
		description: "We host birthdays, dinners and private events in our various spaces. Please share your preferred dates and number of attendees for a quote."

	},
	{
		icon: FileTextIcon, // Make sure to import this from lucide-react
		name: "Cancellation Policy",
		description: "Full refund for cancellations made 48 hours before check-in. Cancellations within 24 hours or no-shows attract a one-night retention charge."
	}
];



const Essential = () => {
	return (
		<>
			<div className="w-full py-10 px-18 bg-neutral-100">
				<h2 className="font-sans font-extrabold text-4xl">Essential Information</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{Informations.map((item, index) => {

						const TheIcon = item.icon;

						return (
							<Card size="sm" className="mx-auto w-full max-w-sm mt-10">
								<CardHeader>
									<CardTitle> <div> <TheIcon className="w-8 h-8 mb-3 text-amber-700" />
									</div> </CardTitle>
									<CardTitle>
										{item.name}
									</CardTitle>
								</CardHeader>
								<CardContent className=" text-neutral-600">
									<p>
										{item.description}
									</p>
								</CardContent>
							</Card>

						)
					})}

				</div>
			</div>
		</>
	)
}

export default Essential
