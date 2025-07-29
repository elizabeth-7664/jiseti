import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../components/ui/Button";
import { Shield, Users, Eye, TrendingUp } from "lucide-react";
import cartoonImage from "../assets/maps.jpg";

const features = [
	{
		icon: Shield,
		title: "Fight Corruption",
		description: "Report and track corruption cases in your community",
	},
	{
		icon: Users,
		title: "Unite Citizens",
		description: "Join forces with others to demand accountability",
	},
	{
		icon: Eye,
		title: "Transparency",
		description: "Monitor government projects and spending",
	},
	{
		icon: TrendingUp,
		title: "Drive Change",
		description: "Create lasting impact through collective action",
	},
];

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-green-50 overflow-hidden">
			<section className="relative min-h-screen flex items-center justify-center">
				{/* Background Image */}
				<div className="absolute inset-0">
					<img
						src={cartoonImage}
						alt="Citizens united against corruption"
						className="w-full h-full object-cover object-top"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-transparent" />
				</div>

				{/* Content */}
				<div className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-16">
					<div className="w-full max-w-6xl flex flex-col lg:flex-row items-start justify-between gap-10 py-10">
						{/* Left Column */}
						<div className="flex flex-col gap-6 w-full lg:w-1/2 items-center lg:items-start text-center lg:text-left">
							{/* Title */}
							<div className="bg-white/90 px-6 py-3 rounded-xl shadow-lg">
								<h1 className="text-4xl font-extrabold text-green-800 tracking-tight">
									Jiseti
								</h1>
							</div>

							{/* Mission */}
							<div className="bg-white/90 px-6 py-5 rounded-xl shadow-lg w-full">
								<p className="text-lg text-green-900 leading-relaxed font-medium">
									<span className="font-bold text-green-700">Jiseti</span> empowers citizens to tackle corruption and urge government action on{" "}
									<span className="font-bold text-green-700">critical issues</span> like poor roads and flooding, driving a more{" "}
									<span className="font-bold text-green-700">transparent and responsive</span> governance system.
								</p>
							</div>

							{/* Buttons */}
							<div className="bg-white/90 px-6 py-5 rounded-xl shadow-lg w-full flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
								<Buttons
									size="lg"
									button="Get Started"
									onClick={() => navigate("/sign_up")}
									className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition w-full sm:w-auto"
								/>
								<Buttons
									variant="outline"
									size="lg"
									button="Sign In"
									onClick={() => navigate("/sign_in")}
									className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition w-full sm:w-auto"
								/>
							</div>
						</div>

						{/* Right Column - Features */}
						<div className="flex flex-col gap-5 w-full lg:w-1/2">
							{features.map((feature) => (
								<div
									key={feature.title}
									className="bg-white/90 px-6 py-5 rounded-xl shadow-lg flex items-center gap-4"
								>
									<div className="w-12 h-12 bg-green-200/50 rounded-lg flex items-center justify-center">
										<feature.icon className="w-6 h-6 text-green-700" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-green-900 mb-1">
											{feature.title}
										</h3>
										<p className="text-green-700 text-sm">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Quote */}
					<div className="w-full flex justify-center mt-4 mb-6">
						<div className="bg-white/90 px-6 py-4 rounded-xl shadow-lg max-w-xl text-center">
							<blockquote className="text-base italic text-green-900 font-serif">
								"Injustice anywhere is a threat to justice everywhere."
							</blockquote>
							<cite className="text-sm text-green-700 font-medium mt-1 block">
								— Martin Luther King Jr.
							</cite>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
