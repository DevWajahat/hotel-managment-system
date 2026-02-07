

const Features = () => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="max-w-(--breakpoint-lg) w-full py-12 px-6">
				<div className="mt-6 md:mt-10 w-full mx-auto grid md:grid-cols-2 gap-12">
					<div>

						<h2
							className="text-4xl mb-10 md:text-5xl md:leading-14 font-semibold tracking-[-0.03em] max-w-lg">
							Defined by elegance,
							designed for you.
						</h2>


						<p className="text-neutral-700 my-10 leading-relaxed ">Peregrine Hotel introduces a premium hospitality destination offering relaxation, business convenience, and unforgettable experiences. Located centrally in the Rayfield–Zarmaganda area, we are your sanctuary of calm amidst the city.</p>


						<ul className="list-none list-inside space-y-2 text-neutral-700">
							<li className="flex gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check-circle" class="lucide lucide-check-circle w-6 h-6 text-amber-700 stroke-[1.5] mt-0.5"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
								Luxury lodging with complimentary breakfast </li>
							<li className="flex gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check-circle" class="lucide lucide-check-circle w-6 h-6 text-amber-700 stroke-[1.5] mt-0.5"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
								Elegant event and leisure facilities </li>
							<li className="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="check-circle" class="lucide lucide-check-circle w-6 h-6 text-amber-700 stroke-[1.5] mt-0.5"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
								Designed for comfort, privacy, and memorable stays </li>
						</ul>
					</div>

					{/* Media */}
					<img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a" className="md:block w-full h-full object-cover rounded-xl" />
				</div>
			</div>
		</div >
	);
};

export default Features;

