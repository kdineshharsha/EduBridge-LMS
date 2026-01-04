

export default function TopPerformingCourses({ courses }) {
    if (!courses || courses.length === 0) {
        return (
            <div className="text-center text-gray-400 py-10">
                No course data available
            </div>
        );
    }

    const maxSales = Math.max(...courses.map(c => c.sales || 1));

    return (
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Course Name
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Category
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Sales
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                            Price
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                    {courses.map(course => (
                        <tr key={course._id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.thumbnail}
                                        alt=""
                                        className="w-10 h-10 rounded-lg object-cover shadow-sm"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">
                                            {course.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {course.students} students
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md border">
                                    {course.category}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-700">
                                        Rs. {course.sales.toLocaleString()}
                                    </span>
                                    <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500"
                                            style={{
                                                width: `${(course.sales / maxSales) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${course.status === "Published"
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-gray-50 text-gray-500 border border-gray-100"
                                        }`}
                                >
                                    {course.status}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-right font-bold text-gray-900 text-sm">
                                {course.price}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
