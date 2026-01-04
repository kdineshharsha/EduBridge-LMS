import Chart from "react-apexcharts";
import { PieChart } from "lucide-react";

export default function CourseHealth({ published = 0, draft = 0 }) {
    const total = published + draft || 1;
    const series = [published, draft];

    const options = {
        chart: {
            type: "donut",
            animations: {
                enabled: true,
                easing: "easeinoutCubic",
                speed: 1400,
                animateGradually: {
                    enabled: true,
                    delay: 250,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 1000,
                },
            },
            dropShadow: {
                enabled: true,
                top: 4,
                left: 0,
                blur: 10,
                opacity: 0.15,
            },
        },

        labels: ["Published", "Draft"],

        colors: ["#2563eb", "#93c5fd"],

        stroke: {
            width: 6,
            colors: ["#ffffff"],
        },

        legend: {
            position: "bottom",
            fontSize: "13px",
            markers: {
                radius: 12,
                width: 10,
                height: 10,
            },
            labels: {
                colors: "#374151",
            },
            itemMargin: {
                horizontal: 14,
                vertical: 8,
            },
        },

        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: "72%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#6b7280",
                            offsetY: -6,
                        },
                        value: {
                            show: true,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#111827",
                            offsetY: 8,
                            formatter: (val) => Math.round(val),
                        },
                        total: {
                            show: true,
                            label: "Total Courses",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#6b7280",
                            formatter: () => total,
                        },
                    },
                },
            },
        },

        dataLabels: {
            enabled: false,
        },

        tooltip: {
            theme: "light",
            y: {
                formatter: (val) => `${val} courses`,
            },
        },

        states: {
            hover: {
                filter: {
                    type: "lighten",
                    value: 0.05,
                },
            },
            active: {
                filter: {
                    type: "darken",
                    value: 0.1,
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Course Health</h2>
                <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            {/* Chart */}
            <Chart options={options} series={series} type="donut" height={270} />

            {/* Footer */}
            <p className="mt-3 text-xs text-gray-500 text-center">
                Keep more courses published to improve visibility
            </p>
        </div>
    );
}
