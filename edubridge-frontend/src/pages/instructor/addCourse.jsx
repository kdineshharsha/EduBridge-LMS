import axios from "axios";
import { Clock, DollarSign, Layers, Link, Tag } from "lucide-react";
import { MdMoneyOff } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSpinner,
  FaFileImage,
  FaImage,
  FaEye,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa";
import { TbFileDescription } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6";

import Select from "react-select";
import mediaUpload from "../../utils/mediaUpload";

export default function AddCourse2() {
  const [activeTab, setActiveTab] = useState("details");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [lessonLink, setLessonLink] = useState("");
  const [lessonFiles, setLessonFiles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  const categoryOptions = [
    { value: "Programming", label: "Programming" },
    { value: "Design", label: "Design" },
    { value: "Business", label: "Business" },
    { value: "Language", label: "Language" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    setIsLoaded(true); // Mark as loaded once component mounts
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log("Updated items:", lessons);
    }
  }, [lessons, isLoaded]);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !price) {
      toast.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    if (!thumbnail) {
      toast.error("Please upload a course thumbnail!");
      setLoading(false);
      return;
    }

    try {
      const fileUrl = await mediaUpload(thumbnail);

      const CourseData = {
        title,
        description,
        price,
        categories,
        thumbnail: fileUrl,
        isPublished,
        isFree,
      };

      const courseResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/create`,
        CourseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const createdCourseId = courseResponse.data.course._id;
      console.log(createdCourseId);

      let LessonsData = [];
      lessons.forEach((lesson) => {
        LessonsData.push({
          title: lesson.title,
          content: lesson.content,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          documentsUrls: lesson.documentsUrls,
          course: createdCourseId,
        });
      });

      async function processLessons(LessonsData) {
        const updatedLessons = [];

        for (const lesson of LessonsData) {
          const docs = [];
          for (const file of lesson.documentsUrls) {
            docs.push(file instanceof File ? await mediaUpload(file) : file);
          }
          updatedLessons.push({ ...lesson, documentsUrls: docs });
        }
        return updatedLessons;
      }

      LessonsData = await processLessons(LessonsData);
      console.log(CourseData);
      console.log(LessonsData);

      const payload = {
        lessons: LessonsData.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
        })),
      };

      console.log(payload);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/course/lesson/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Bulk lessons created:", res.data);

      // await axios.post(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/course/lesson/create`,
      //   LessonsData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );

      toast.success("Course created successfully!");
      setLoading(false);
      navigate("/instructor/courses");
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddLesson = async () => {
    const newLesson = {
      title: lessonTitle,
      content: lessonDescription,
      duration: duration,
      videoUrl: lessonLink,
      documentsUrls: lessonFiles,
    };
    setLessons((prevLessons) => [...prevLessons, newLesson]);

    setLessonTitle("");
    setLessonDescription("");
    setDuration("");
    setLessonLink("");
    setLessonFiles([]);

    toast.success("Lesson added successfully!");
  };

  return (
    <div className="w-full overflow-y-scroll scrollbar-hide h-full bg-secondary p-6 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Add New Course</h1>
      </div>

      {/* Tabs */}
      <div className="flex  my-6 ">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "details"
            ? "text-purple-600 border-b-2 border-b-blue-500   "
            : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
            }`}
        >
          Course Details
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "lessons"
            ? "text-purple-600  border-b-2 border-b-blue-500 "
            : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
            }`}
        >
          Lessons
        </button>

      </div>

      {activeTab === "details" && (
        <div className="p-8 border-2 rounded-lg border-blue-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="size-4" />
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter course title..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value.replace(/\b\w/g, (c) => c.toUpperCase())
                  )
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="size-4" />
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your course in detail..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Price */}
            {!isFree && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Course Price (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter course price..."
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers className="size-4" />
                Course Categories <span className="text-red-500">*</span>
              </label>
              <Select
                isMulti
                options={categoryOptions}
                value={categories.map((c) => ({ value: c, label: c }))}
                onChange={(selected) =>
                  setCategories(selected.map((opt) => opt.value))
                }
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-purple-500" />
                Course Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="product-image-input"
                  className="hidden"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
                <label
                  htmlFor="product-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-purple-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                      Click to upload course thumbnail
                    </p>
                  </div>
                </label>
              </div>
              {thumbnail && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="preview"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Publishing Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Publishing Settings
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdMoneyOff className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Show as Free Course
                      </p>
                      <p className="text-sm text-gray-600">
                        Display as a free course on the platform
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFree(!isFree)}
                    className="text-2xl transition-colors"
                  >
                    {isFree ? (
                      <FaToggleOn className="text-green-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-700">
                        Publish Course
                      </p>
                      <p className="text-sm text-gray-600">
                        Make course visible to users
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className="text-2xl transition-colors"
                  >
                    {isPublished ? (
                      <FaToggleOn className="text-blue-500" />
                    ) : (
                      <FaToggleOff className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Adding Course...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Add Course
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "lessons" && (
        <div className="p-8 border-2 rounded-lg border-blue-500 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-700">Add Lessons</h3>

          <div className="space-y-4">
            {/* Lesson Title*/}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="size-4" />
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter lesson title..."
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            {/* Lesson Duration */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="size-4" />
                Lesson Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter lesson duration(in minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Link className="size-4" />
                Lesson Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter lesson URL..."
                value={lessonLink}
                onChange={(e) => setLessonLink(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TbFileDescription className="size-4" />
                Course Description
              </label>
              <textarea
                placeholder="Describe your course in detail..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none"
                rows="4"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaRegFilePdf className="size-4" />
                Upload Documents (Optional)
              </label>
              <input
                multiple
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                onChange={(e) => {
                  setLessonFiles(Array.from(e.target.files));
                  e.target.value = "";
                }}
                className="w-full border-2 border-dashed border-gray-300 px-4 py-3 rounded-xl hover:border-purple-500 transition-colors cursor-pointer"
              />
            </div>

            <button
              onClick={handleAddLesson}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              + Add Lesson
            </button>
          </div>

          {lessons.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="text-lg font-semibold text-gray-700">
                Added Lessons
              </h4>
              {lessons.map((lesson, i) => (
                <div
                  key={i}
                  className="border-2 border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-medium text-gray-800">
                    {lesson.title}
                  </span>
                  {lesson.video && <FaEye className="text-blue-500" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
