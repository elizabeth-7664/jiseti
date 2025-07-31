// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Megaphone, Eye, Users } from "lucide-react";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner"; // Import Spinner
import Alert from "../components/ui/Alert";   // Import Alert
import { getReports } from "../utils/api"; // Import getReports API function

const features = [
    {
        icon: <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-500" />,
        title: "Fight Corruption",
        description: "Report unethical practices directly to authorities in real time.",
    },
    {
        icon: <Megaphone className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />,
        title: "Raise Your Voice",
        description: "Be heard. Mobilize communities and demand accountability.",
    },
    {
        icon: <Eye className="w-8 h-8 text-blue-600 dark:text-blue-500" />,
        title: "Transparent Tracking",
        description: "See the status of your report as it progresses through review.",
    },
    {
        icon: <Users className="w-8 h-8 text-green-600 dark:text-green-500" />,
        title: "Community Power",
        description: "Join a growing community committed to integrity and justice.",
    },
];

export default function HomePage() {
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = useCallback(async () => {
        setLoadingReports(true);
        setError(null);
        try {
            const response = await getReports();
            // Sort reports by created_at in descending order (newest first)
            const sortedReports = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setReports(sortedReports);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            setError("Failed to load recent reports. Please try again later.");
        } finally {
            setLoadingReports(false);
        }
    }, []);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-12 md:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <header className="text-center mb-16 md:mb-20">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
                        Welcome to{" "}
                        <span className="text-red-700 dark:text-red-500">Jiseti</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A platform for exposing corruption and requesting urgent government
                        interventions, fostering transparency and accountability.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/create">
                            <Button size="lg" className="w-full sm:w-auto">
                                Report Corruption
                            </Button>
                        </Link>
                        <Link to="/posts">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                View All Reports
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Recent Reports Section (Newspaper Style) - NOW FIRST AFTER HERO */}
                <section className="pt-10 border-t border-gray-200 dark:border-gray-700 mb-20"> {/* Added mb-20 for spacing */}
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">Recent Reports</h2>
                    {loadingReports ? (
                        <div className="flex justify-center py-10">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <Alert type="error" message={error} onDismiss={() => setError(null)} />
                    ) : reports.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-400 py-10">No recent reports found. Be the first to report!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reports.slice(0, 6).map((report) => (
                                <Link to={`/reports/${report.id}`} key={report.id} className="block">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col hover:shadow-xl transition-all duration-300">
                                        {report.image_url && report.image_url.split(',')[0] ? (
                                            <div className="mb-4 rounded-md overflow-hidden">
                                                <img
                                                    src={report.image_url.split(',')[0]}
                                                    alt={report.title}
                                                    className="w-full h-48 object-cover rounded-md"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x200/cccccc/333333?text=No+Image`; }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mb-4">
                                                <span className="text-gray-400 dark:text-gray-500 text-sm">No Image</span>
                                            </div>
                                        )}

                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">{report.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{report.description}</p>
                                        <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <span className="mr-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                                                {report.category.replace(/-/g, ' ')}
                                            </span>
                                            <span className="mr-2">| {report.location}</span>
                                            <span className="mr-2">| {report.author ? report.author.username : 'Anonymous'}</span>
                                            <span>| {new Date(report.created_at).toLocaleDateString()}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${report.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                  report.status === 'under-investigation' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                                  report.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {report.status.replace(/-/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {reports.length > 0 && (
                        <div className="text-center mt-10">
                            <Link to="/posts">
                                <Button variant="outline" size="lg">View All Reports</Button>
                            </Link>
                        </div>
                    )}
                </section>

                {/* Features Section - NOW LAST AFTER RECENT REPORTS */}
                <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
                        >
                            <div className="mb-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 p-3">
                                {feature.icon}
                            </div>
                            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
