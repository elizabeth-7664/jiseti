import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Shield, Users, Eye, TrendingUp, BarChart, CheckCircle } from "lucide-react";
import cartoonImage from "../assets/maps.jpg"; // kept for reference though we are using a gradient hero

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
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden font-sans">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12">
                {/* Background Gradient & Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 z-0" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>
                
                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Civic Tech Platform
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Your Voice Against <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Corruption</span>
                    </h1>

                    {/* Mission */}
                    <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
                        Jiseti empowers citizens to tackle corruption and urge government action on critical issues, driving a more transparent and responsive governance system.
                    </p>

                    {/* Dual CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
                        <Button
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-0 shadow-lg shadow-emerald-900/50 py-3 px-8 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() => navigate("/register")}
                        >
                            Get Started Now
                        </Button>
                        <Button
                            className="bg-transparent border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 py-3 px-8 rounded-full font-semibold transition-all duration-300"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </Button>
                    </div>

                    {/* Floating Statistics Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                        {[
                            { label: "Reports Filed", value: "12,500+", icon: BarChart },
                            { label: "Cases Resolved", value: "85%", icon: CheckCircle },
                            { label: "Active Citizens", value: "45,000+", icon: Users },
                            { label: "Regions Covered", value: "24", icon: Shield },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <stat.icon className="w-6 h-6 text-emerald-400 mb-2 opacity-80" />
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs md:text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="relative z-10 py-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Tools for Transparency
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Everything you need to make a difference in your community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                                <feature.icon className="w-7 h-7 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;