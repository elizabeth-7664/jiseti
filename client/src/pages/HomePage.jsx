import React from "react"
import { Link } from "react-router-dom"
import { ShieldAlert, Megaphone, Eye, Users } from "lucide-react"
import  Button  from "../components/ui/Button"

const features = [
	{
		icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
		title: "Fight Corruption",
		description: "Report unethical practices directly to authorities in real time.",
	},
	{
		icon: <Megaphone className="w-6 h-6 text-yellow-500" />,
		title: "Raise Your Voice",
		description: "Be heard. Mobilize communities and demand accountability.",
	},
	{
		icon: <Eye className="w-6 h-6 text-blue-500" />,
		title: "Transparent Tracking",
		description: "See the status of your report as it progresses through review.",
	},
	{
		icon: <Users className="w-6 h-6 text-green-600" />,
		title: "Community Power",
		description: "Join a growing community committed to integrity and justice.",
	},
]

export default function HomePage() {
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
			<div className="max-w-6xl mx-auto">
				<header className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-extrabold mb-4">
						Welcome to{" "}
						<span className="text-red-600">Jiseti</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
						A platform for exposing corruption and requesting urgent government
						interventions.
					</p>
					<div className="mt-6 flex justify-center gap-4">
						<Link to="/create-post">
							<Button className="bg-red-600 hover:bg-red-700 text-white">
								Report Corruption
							</Button>
						</Link>
						<Link to="/posts">
							<Button variant="outline">View Reports</Button>
						</Link>
					</div>
				</header>

				<section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition"
						>
							<div className="mb-4">{feature.icon}</div>
							<h3 className="font-semibold text-lg">{feature.title}</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{feature.description}
							</p>
						</div>
					))}
				</section>
			</div>
		</div>
	)
}
