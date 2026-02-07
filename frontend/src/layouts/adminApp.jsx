import React from "react";
import { AppSidebar } from "../components/dashboard/app-sidebar"
import { ChartAreaInteractive } from "../components/dashboard/chart-area-intercative"
import { DataTable } from "../components/dashboard/data-table"
import { SectionCards } from "../components/dashboard/section-cards"
import { SiteHeader } from "../components/dashboard/site-header"
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"
import data from "../app/dashboard/data.json"

const AdminApp = ({ children }) => {
	return (
		<>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "calc(var(--spacing) * 72)",
						"--header-height": "calc(var(--spacing) * 12)",
					}
				}
			>
				<AppSidebar />
				<SidebarInset>
					<SiteHeader />
					<div className="flex flex-1 flex-col">
						<div className="@container/main flex flex-1 flex-col gap-2">
							<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-10">
								<main>
									{children}
								</main>
								{/* <SectionCards /> */}
								{/* <div className="px-4 lg:px-6"> */}
								{/* 	<ChartAreaInteractive /> */}
								{/* </div> */}
								{/* <DataTable data={data} /> */}
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>

		</>
	)
}

export default AdminApp

