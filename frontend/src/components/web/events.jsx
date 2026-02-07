import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const eventLists = [
	{ name: "Event / Conference Hall", price: "$500,000" },
	{ name: "Board Room", price: "$220,000" },
	{ name: "Restaurant", price: "$400,000" },
	{ name: "Pool Area & Outdoor Bar", price: "$600,000" },
	{ name: "Pool Area Only", price: "$300,000" },
	{ name: "Outdoor Bar Only", price: "$200,000" },
	{ name: "Green Area (Large)", price: "$300,000" },
	{ name: "Swimming Pool Access", price: "$5,000" }
]

function Events() {
	return (
		<>
			<div className="w-full py-25  bg-zinc-800 flex justify-center items-center flex-col">

				<div className="flex flex-col justify-center items-center gap-2">
					<h4 className="font-sans text-amber-500 text-xl font-semibold">VENUE HIRE</h4>
					<h2 className="font-sans text-2xl md:text-4xl font-bold text-white">Facilities & Event Rates</h2>

				</div>

				<div className='w-full md:w-[50vw] mt-20'>
					<Card className="bg-transparent outline-none border-none  text-foreground w-full md:w-[50vw] ">
						<CardContent className="p-0">
							{eventLists.map((item, index) => (

								<div key={index}>
									{index == 0 && <Separator />}

									<div className="flex justify-between items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors">
										<span className='text-white font-normal font-sans '>{item.name}</span>
										<span className="text-orange-500 font-bold">{item.price}</span>
									</div>
									{/* {index !== eventLists.length && <Separator />} */}
									<Separator />
								</div>
							))}

							{/* ))} */}
						</CardContent>
					</Card>
				</div>
			</div>

		</>
	)
}

export default Events
