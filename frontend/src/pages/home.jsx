

import Hero from "../components/web/hero"
import Navbar from "../components/web/navbar"
import Features from '../components/web/features'
import Events from '../components/web/events'
import Amenities from '../components/web/amenities'
import Rooms from '../components/web/rooms'
import Essential from '../components/web/essential'
import Footer from '../components/web/footer'



const Home = () => {
	return (
		<>
			<Navbar />
			<Hero />
			<Features />
			<Amenities />
			<Rooms />
			<Events />
			<Essential />
			<Footer />

		</>
	)
}

export default Home
