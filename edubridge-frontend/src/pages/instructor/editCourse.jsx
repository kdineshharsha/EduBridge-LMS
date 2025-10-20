import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import mediaUpload from "../../utils/mediaUpload";

import {
  DollarSign,
  Layers,
  Tag,
  Clock,
  Link as LinkIcon,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  FaPlus,
  FaSpinner,
  FaFileImage,
  FaImage,
  FaEye,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6";

export default function EditCourse() {
  const navigate = useNavigate();
  const params = useParams();

  const [course, setCourse] = useState({});
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);

  // Course fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [lessons, setLessons] = useState([]);

  // Lesson form
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [lessonLink, setLessonLink] = useState("");
  const [lessonFiles, setLessonFiles] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const categoryOptions = [
    { value: "Programming", label: "Programming" },
    { value: "Design", label: "Design" },
    { value: "Business", label: "Business" },
    { value: "Language", label: "Language" },
    { value: "UI/UX", label: "UI/UX" },
    { value: "Other", label: "Other" },
  ];

  // 🧠 Load data from route
  useEffect(() => {
    const courseId = params.id;
    if (!courseId) {
      toast.error("No course data provided for editing.");
      navigate("/instructor/courses");
      return;
    }
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourse(response.data);
        setTitle(response.data.title || "");
        setDescription(response.data.description || "");
        setPrice(response.data.price || "");
        setCategories(response.data.categories || []);
        setThumbnail(response.data.thumbnail || null);
        setIsPublished(response.data.isPublished || false);
        setIsFree(response.data.isFree || false);
        setLessons(response.data.lessons || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
        setLoading(false);
      });
  }, [params.id, navigate]);

  // ✅ Update course
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !title ||
        !description ||
        (!isFree && !price) ||
        categories.length === 0
      ) {
        toast.error("Please fill in all required fields!");
        setLoading(false);
        return;
      }

      let fileUrl =
        typeof thumbnail === "string"
          ? thumbnail
          : await mediaUpload(thumbnail);

      const token = localStorage.getItem("token");
      const courseData = {
        title,
        description,
        price: isFree ? 0 : price,
        categories,
        thumbnail: fileUrl,
        isPublished,
        isFree,
      };

      // Update course info
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/update/${course._id}`,
        courseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Course updated successfully!");
      navigate("/instructor/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course!");
    } finally {
      setLoading(false);
    }
  }

  // ➕ ADD NEW LESSON or CLEAR FORM
  const handleAddLesson = async () => {
    if (!lessonTitle) return toast.error("Enter lesson title!");

    try {
      const token = localStorage.getItem("token");

      let uploadedFileUrl = "";
      if (lessonFiles) uploadedFileUrl = await mediaUpload(lessonFiles);

      const newLesson = {
        title: lessonTitle,
        content: lessonDescription,
        videoUrl: lessonLink || uploadedFileUrl,
        duration: duration || 0,
        order: lessons.length + 1,
        course: course._id,
      };

      // ✅ Create new lesson in backend
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/course/lesson/create`,
        newLesson,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update lessons state
      setLessons([...lessons, res.data.lesson]);

      // Reset input fields
      resetLessonForm();
      toast.success("Lesson added successfully!");
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson!");
    }
  };

  // ✏️ EDIT LESSON - Load data into form
  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.content);
    setLessonLink(lesson.videoUrl);
    setDuration(lesson.duration);
  };

  // 💾 UPDATE LESSON
  const handleUpdateLesson = async () => {
    if (!lessonTitle) return toast.error("Enter lesson title!");
    if (!editingLessonId) return toast.error("No lesson selected!");

    try {
      const token = localStorage.getItem("token");

      const updatedLesson = {
        title: lessonTitle,
        content: lessonDescription,
        videoUrl: lessonLink,
        duration,
      };

      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course/lesson/update/${editingLessonId}`,
        updatedLesson,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update frontend lessons array
      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson._id === editingLessonId ? res.data.lesson : lesson
        )
      );

      // Reset fields
      resetLessonForm();
      toast.success("Lesson updated successfully!");
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson!");
    }
  };

  // 🗑️ DELETE LESSON
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/course/lesson/delete/${lessonId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Remove from frontend
      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson._id !== lessonId)
      );

      toast.success("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson!");
    }
  };

  // 🔄 RESET FORM
  const resetLessonForm = () => {
    setLessonTitle("");
    setLessonDescription("");
    setLessonLink("");
    setLessonFiles(null);
    setDuration("");
    setEditingLessonId(null);
  };

  return (
    <div className="w-full overflow-y-scroll scrollbar-hide h-full bg-secondary p-6 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Edit Course</h1>
      </div>

      {/* Tabs */}
      <div className="flex my-6">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "details"
              ? "text-purple-600 border-b-2 border-b-blue-500"
              : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
          }`}
        >
          Course Details
        </button>
        <button
          onClick={() => setActiveTab("lessons")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "lessons"
              ? "text-purple-600 border-b-2 border-b-blue-500"
              : "text-gray-500 hover:text-purple-500 border-b-white border-b-2"
          }`}
        >
          Lessons
        </button>
      </div>

      {/* 🧾 DETAILS TAB */}
      {activeTab === "details" && (
        <div className="p-8 border-2 rounded-lg border-blue-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="size-4" /> Course Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Enter course title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="size-4" /> Course Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            {/* Price */}
            {!isFree && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="size-4" /> Price (LKR)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            )}

            {/* Categories */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Layers className="size-4" /> Categories
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
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaImage className="text-purple-500" /> Thumbnail
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="thumbnail"
                  className="hidden"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                />
                <label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer group"
                >
                  <FaFileImage className="text-3xl text-gray-400 group-hover:text-purple-500 mb-2" />
                  <p className="text-sm text-gray-600 group-hover:text-purple-600">
                    Click to upload new thumbnail
                  </p>
                </label>
              </div>

              {thumbnail && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={
                      typeof thumbnail === "string"
                        ? thumbnail
                        : URL.createObjectURL(thumbnail)
                    }
                    alt="preview"
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Publishing */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MdMoneyOff className="text-blue-500" />
                  <div>
                    <p className="font-medium">Show as Free Course</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsFree(!isFree)}>
                  {isFree ? (
                    <FaToggleOn className="text-green-500 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-400 text-2xl" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaEye className="text-blue-500" />
                  <p className="font-medium">Publish Course</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                >
                  {isPublished ? (
                    <FaToggleOn className="text-blue-500 text-2xl" />
                  ) : (
                    <FaToggleOff className="text-gray-400 text-2xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaPlus /> Update Course
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/instructor/courses")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📚 LESSONS TAB */}
      {activeTab === "lessons" && (
        <div className="p-8 border-2 rounded-lg border-blue-500 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-700">
            {editingLessonId ? "Edit Lesson" : "Add New Lesson"}
          </h3>

          {/* Add/Edit Lesson Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Tag className="size-4" /> Lesson Title
              </label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Enter lesson title..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="size-4" /> Duration (mins)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Lesson duration"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <LinkIcon className="size-4" /> Lesson Video URL
              </label>
              <input
                type="text"
                value={lessonLink}
                onChange={(e) => setLessonLink(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="Enter Vimeo or YouTube URL..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <TbFileDescription className="size-4" /> Description
              </label>
              <textarea
                rows="4"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                placeholder="Enter lesson description..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaRegFilePdf className="size-4" /> Upload Documents (optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                onChange={(e) => setLessonFiles(e.target.files[0])}
                className="w-full border-2 border-dashed border-gray-300 px-4 py-3 rounded-xl hover:border-purple-500 transition-all cursor-pointer"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={editingLessonId ? handleUpdateLesson : handleAddLesson}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                {editingLessonId ? "💾 Update Lesson" : "+ Add Lesson"}
              </button>
              {editingLessonId && (
                <button
                  onClick={resetLessonForm}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Existing Lessons */}
          {lessons.length > 0 && (
            <div className="mt-6 space-y-2">
              <h4 className="text-lg font-semibold text-gray-700">
                Current Lessons ({lessons.length})
              </h4>
              {lessons.map((lesson, i) => (
                <div
                  key={lesson._id}
                  className="border-2 border-gray-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">
                      {i + 1}. {lesson.title}
                    </span>
                    {lesson.videoUrl && (
                      <div className="flex items-center gap-1 text-xs text-purple-500 mt-1">
                        <FaEye className="text-purple-500" /> Video
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="border-2 px-3 py-2 rounded-lg border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      <Pencil className="text-blue-600 size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="border-2 px-3 py-2 rounded-lg border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="text-red-600 size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
