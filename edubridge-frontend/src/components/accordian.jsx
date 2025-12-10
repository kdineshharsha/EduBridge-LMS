import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

// Utility to extract Vimeo video ID from URL
const extractVimeoId = (url) => {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

// Accordion Item
export const AccordionItem = ({
  title,
  content,
  videoUrl,
  duration,
  onSelect,
  documentsUrl = [],
  hasQuiz,
  quizId,
  lastAttemptStatus,
  attemptCount,
  remainingAttempts,
  attemptsAllowed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-200 transition-all duration-300">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-all"
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-gray-800 truncate">{title}</span>
          <div className="flex items-center gap-4">
            {duration && (
              <span className="text-sm text-gray-500">{duration} min</span>
            )}
            <span
              className={`text-xl text-gray-600 transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              <IoIosArrowDown />
            </span>
          </div>
        </div>
      </button>

      {/* Accordion Body */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-3 bg-white space-y-3 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed">{content}</p>

          <div className=" flex flex-col items-start gap-4 ">
            {/* PLAY LESSON */}
            {videoUrl && (
              <button
                onClick={() => onSelect(videoUrl)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                ▶ Play Lesson
              </button>
            )}
            {/* QUIZ BUTTON */}
            {hasQuiz && (
              <button
                onClick={() => navigate(`/quiz/overview/${quizId}`)}
                className=" text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 hover:text-white transition-all ring-red-600 ring-2"
              >
                📝 Take Quiz
              </button>
            )}
          </div>

          {/* DOCUMENTS */}
          {documentsUrl.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700">Files:</p>
              <ul className="list-disc pl-5 space-y-1">
                {documentsUrl.map((doc, index) => {
                  const url = typeof doc === "string" ? doc : doc.url;
                  const name = url
                    .split("/")
                    .pop()
                    .split(".")[0]
                    .replace(/%20/g, " ");
                  return (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className=" flex justify-between items-center w-full mt-2 ">
            {/* ATTEMPTS INFO */}
            {hasQuiz && (
              <p className="text-xs text-gray-600 mt-1">
                Attempts:{" "}
                {attemptsAllowed === null
                  ? `${attemptCount}/∞`
                  : `${attemptCount}/${attemptsAllowed}`}
                {attemptsAllowed !== null &&
                  remainingAttempts !== undefined &&
                  ` (Remaining: ${remainingAttempts})`}
              </p>
            )}

            {/* QUIZ STATUS BADGE */}
            {hasQuiz && (
              <div className="mt-2">
                {lastAttemptStatus === "passed" && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    ✔ Passed
                  </span>
                )}

                {lastAttemptStatus === "failed" && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    ✘ Failed
                  </span>
                )}

                {lastAttemptStatus === "not_attempted" && (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold">
                    • Not Attempted
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CourseLessons = ({ lessons = [], thumbnail }) => {
  const [selectedVideo, setSelectedVideo] = useState(
    lessons?.[0]?.videoUrl || null
  );
  const selectedId = extractVimeoId(selectedVideo);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-full">
      {/* LEFT: Accordion */}
      <div className="w-full md:w-[40%] h-full overflow-y-auto shadow-md rounded-lg bg-white border border-gray-200">
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson._id}
            title={lesson.title}
            content={lesson.content}
            videoUrl={lesson.videoUrl}
            duration={lesson.duration}
            onSelect={setSelectedVideo}
            documentsUrl={lesson.documentsUrls}
            hasQuiz={lesson.hasQuiz}
            quizId={lesson.quizId}
            lastAttemptStatus={lesson.lastAttemptStatus}
            attemptCount={lesson.attemptCount}
            remainingAttempts={lesson.remainingAttempts}
            attemptsAllowed={lesson.attemptsAllowed}
          />
        ))}
      </div>

      {/* RIGHT: Vimeo Player */}
      <div className="bg-gray-200 flex-1 h-full rounded-lg shadow-md p-4">
        {selectedId ? (
          <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
            <iframe
              src={`https://player.vimeo.com/video/${selectedId}?badge=0&autopause=0&player_id=0&app_id=58479`}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              title="Lesson Video"
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Course Thumbnail"
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="absolute text-gray-600 text-lg">
                Select a lesson to start watching
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessons;
