import { Button } from "@/components/ui/button";
import { Logo } from "../web/logo";
import { NavMenu } from "../web/nav-menu";
import { NavigationSheet } from "../web/navigation-sheet";
import { Link } from "react-router";


const Navbar = () => {
	return (
		<nav
			className="fixed top-6 inset-x-4 z-50 h-16 bg-black/30  backdrop-blur-lg bg-opacity-0 border max-w-(--breakpoint-xl) mx-auto rounded-full">
			<div className="h-full flex items-center  justify-between mx-auto px-4">
				<Logo />

				{/* Desktop Menu */}
				<NavMenu className="hidden md:block" />

				<div className="flex items-center gap-3">

					<Link to="/login" >	<Button variant="outline" className="hidden sm:inline-flex rounded-full">
						Log In
					</Button> </Link>
					<Link to="/register" > <Button className="rounded-full">
						Register
					</Button> </Link>
					{/* Mobile Menu */}
					<div className="md:hidden">
						<NavigationSheet />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
