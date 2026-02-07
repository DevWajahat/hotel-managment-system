import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const navItems = [
	{ label: "About", path: "#" },
	{ label: "Amenities", path: "#" },
	{ label: "Rooms", path: "#" },
	{ label: "Event", path: "#" },
];

export const NavMenu = (props) => (
	<NavigationMenu {...props}>
		<NavigationMenuList className="space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
			{navItems.map((item) => (
				<NavigationMenuItem key={item.label}>
					<NavigationMenuLink
						asChild
						className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent hover:text-neutral-300 font-sans font-bold text-white mix-blend-difference  `}
					>
						<Link to={item.path}>
							{item.label}
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			))}
		</NavigationMenuList>
	</NavigationMenu>
);
