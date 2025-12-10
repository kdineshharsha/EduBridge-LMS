import { useState, useEffect } from "react";
import axios from "axios";

export default function CommentSection({ courseId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  // Fetch reviews from backend
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/review/${courseId}`
        );
        console.log(res.data);
        const fetched = res.data.reviews.map((r) => ({
          id: r._id,
          user: `${r.userId.firstName} ${r.userId.lastName}`,
          avatar: r.avatar,
          rating: r.rating,
          comment: r.comment,
          time: new Date(r.createdAt).toLocaleDateString(),
        }));
        setComments(fetched);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    }
    fetchReviews();
  }, [courseId]);

  async function handleAddComment() {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `
        ${import.meta.env.VITE_BACKEND_URL}/api/review`,
        { courseId, rating, comment: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh reviews after posting
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/review/${courseId}`
      );
      const fetched = res.data.reviews.map((r) => ({
        id: r._id,
        user: `${r.userId.firstName} ${r.userId.lastName}`,
        avatar: r.avatar,
        rating: r.rating,
        comment: r.comment,
        time: new Date(r.createdAt).toLocaleDateString(),
      }));
      setComments(fetched);

      setText("");
      setRating(5);
    } catch (error) {
      console.error("Failed to post review", error);
    } finally {
      setLoading(false);
    }
  }

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: comments.filter((c) => c.rating === star).length,
  }));

  const total = comments.length;

  return (
    <div className="w-full mx-auto bg-white lg:p-16 p-4  shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT — Rating Summary */}
        <div className="p-5 bg-gray-100 rounded-xl h-fit md:sticky md:top-5">
          <h3 className="text-lg font-medium mb-4">Rating Breakdown</h3>

          {ratingCounts.map((r) => {
            const percentage = total === 0 ? 0 : (r.count / total) * 100;
            return (
              <div key={r.star} className="flex items-center mb-3 gap-3">
                <span className="w-10 font-medium">{r.star} ★</span>
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-3"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-gray-700">{r.count}</span>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Add Comment + Comments List */}
        <div className="md:col-span-2">
          {/* Add Comment Box */}
          <div className="mb-6">
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comment..."
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex items-center gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              onClick={handleAddComment}
              disabled={loading}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-5">
            {comments.map((c) => (
              <div
                key={c.id}
                className="border border-gray-200 rounded-2xl p-4 bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  {/* Avatar with fallback initials */}
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden text-white font-bold text-lg">
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {c.user.split(" ")[0]?.charAt(0).toUpperCase()}
                        {c.user.split(" ")[1]?.charAt(0).toUpperCase()}
                      </>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{c.user}</h4>
                      <span className="text-sm text-gray-500">{c.time}</span>
                    </div>

                    <div className="text-yellow-400 text-lg">
                      {"★".repeat(c.rating)}
                      <span className="text-gray-400">
                        {"★".repeat(5 - c.rating)}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-700">{c.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
