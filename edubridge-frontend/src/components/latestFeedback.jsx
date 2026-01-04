import { Star, MessageCircle } from "lucide-react";

export default function LatestFeedback({ feedback }) {
    if (!feedback) {
        return (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex-1 flex items-center justify-center text-center">
                <p className="text-sm text-gray-500">
                    No feedback yet.<br />Reviews will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex-1">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <MessageCircle className="w-24 h-24" />
            </div>

            <h3 className="text-lg font-bold mb-2 relative z-10">
                Latest Feedback
            </h3>

            <p className="text-sm text-blue-100 italic mb-4 relative z-10 line-clamp-3">
                “{feedback.comment}”
            </p>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-semibold">
                        {feedback.student}
                    </p>
                    <p className="text-xs text-blue-200">
                        {feedback.course}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-sm">{feedback.rating}</span>
                </div>
            </div>
        </div>
    );
}
