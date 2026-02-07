import {
	BedDoubleIcon,
	UtensilsIcon,
	MartiniIcon,
	BriefcaseIcon,
	MicIcon,
	WavesIcon,
	MusicIcon,
	FlowerIcon,
	ShoppingBagIcon,
	ShirtIcon,
	TreePineIcon,
	ChefHatIcon,
	Flower,
	Icon,
} from "lucide-react"


const amenities = [
	{ name: "Luxury Lodging", icon: BedDoubleIcon },
	{ name: "Fine Dining", icon: UtensilsIcon },
	{ name: "Bars & Lounge", icon: MartiniIcon },
	{ name: "Boardroom", icon: BriefcaseIcon },
	{ name: "Events Hall", icon: MicIcon },
	{ name: "Adult & Kid Pool", icon: WavesIcon },
	{ name: "Live Band", icon: MusicIcon },
	{ name: "Spa & Wellness", icon: FlowerIcon },
	{ name: "Gift Shop", icon: ShoppingBagIcon },
	{ name: "Laundry Services", icon: ShirtIcon },
	{ name: "Green Areas", icon: TreePineIcon },
	{ name: "Catering", icon: ChefHatIcon }
]


const Amenities = () => {
	return (
		<>
			<div className="w-full px-20 py-20  bg-gray-100 flex justify-center items-center flex-col ">
				<div className="flex flex-col justify-center items-center gap-2 mb-20">
					<h4 className="font-sans text-amber-700 text-xl font-semibold">AMENITIES</h4>
					<h2 className="font-sans text-2xl md:text-4xl font-bold text-black">Our Services & Amenities</h2>
					<p className="text-neutral-700 text-center leading-relaxed text-lg md:text-xl">Curated specifically for business travelers, leisure guests, and high-end socialites.</p>
				</div>

				<div className="w-full  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-px gap-y-px bg-neutral-200 border border-neutral-200 overflow-hidden rounded-2xl">

					{amenities.map((item, index) => {

						const TheIcon = item.icon;
						return (

							<div className="bg-white  group hover:bg-neutral-50 py-6  transition-colors flex flex-col items-center text-center gap-4">
								<div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
									<TheIcon className="w-4 h-4 " />
								</div>
								<p className="font-sans font-semibold text-lg text-neutral-900">{item.name}</p>

							</div>

						)
					})}

					{/* <div className="bg-white p-8 group hover:bg-neutral-50 transition-colors flex flex-col items-center text-center gap-4"> */}
					{/**/}
					{/* </div> */}
					{/**/}
					{/* <div className="bg-white p-8 group hover:bg-neutral-50 transition-colors flex flex-col items-center text-center gap-4"> */}
					{/**/}
					{/* </div> */}
					{/**/}
					{/**/}
					{/* <div className="bg-white p-8 group hover:bg-neutral-50 transition-colors flex flex-col items-center text-center gap-4"> */}
					{/**/}
					{/* </div> */}

				</div>

			</div>
		</>
	)
}

export default Amenities
