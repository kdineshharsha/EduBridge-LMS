import { useState } from "react";

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
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-200 hover:bg-gray-300 transition-all"
      >
        <span className="font-medium text-gray-800">{title}</span>
        <span className="text-xl text-gray-600">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="px-4 py-3 bg-white space-y-3">
          <p className="text-gray-700">{content}</p>

          {videoUrl && (
            <button
              onClick={() => onSelect(videoUrl)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all"
            >
              ▶ Play Lesson
            </button>
          )}

          {duration && (
            <p className="text-xs text-gray-500">Duration: {duration} mins</p>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
const CourseLessons = ({ lessons, thumbnail }) => {
  const [selectedVideo, setSelectedVideo] = useState(
    lessons?.[0]?.videoUrl || null
  );

  const selectedId = extractVimeoId(selectedVideo);

  return (
    <div className="flex gap-6 w-full h-full">
      {/* LEFT: Accordion */}
      <div className="w-[40%] h-full overflow-y-auto shadow-md rounded-md bg-white border border-gray-200">
        {lessons.map((lesson) => (
          <AccordionItem
            key={lesson._id}
            title={lesson.title}
            content={lesson.content}
            videoUrl={lesson.videoUrl}
            duration={lesson.duration}
            onSelect={setSelectedVideo}
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
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
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
