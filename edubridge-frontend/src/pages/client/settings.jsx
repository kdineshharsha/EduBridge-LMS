import React, { useEffect, useState } from "react";
import { User, Bell, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const userRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(userRes.data.user);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        toast.error("Failed to fetch user");
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-6 pb-24">
      <div className="bg-white w-full rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
          Settings
        </h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
          <TabButton
            label="Profile Settings"
            icon={User}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            label="Notifications"
            icon={Bell}
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <TabButton
            label="Change Password"
            icon={Lock}
            active={activeTab === "password"}
            onClick={() => setActiveTab("password")}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "password" && <ChangePassword />}
        </div>
      </div>
    </div>
  );
}

//
// TAB BUTTON
//
function TabButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all
        ${
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

//
// PROFILE SETTINGS TAB
//
function ProfileSettings({ user }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  // Load user into input fields
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save to backend
  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      logout();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      logout();
      window.location.href = "/";
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  if (!user)
    return <p className="text-gray-500 text-sm">Loading user data...</p>;

  return (
    <div className="space-y-6 ">
      <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InputField
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
        />

        <InputField
          name="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />

        <InputField
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          name="phone"
          label="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full md:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Save Changes
      </button>

      <div className="border-t border-gray-300 space-y-6 pt-6">
        <div className="">
          {" "}
          <h2 className="text-lg font-semibold text-gray-800">
            Danger Zone ⚠️
          </h2>
          <p className="text-sm text-gray-600">
            Permanently remove your account and all data
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="w-full md:w-auto px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-700 transition"
        >
          Delete Account
        </button>{" "}
      </div>
    </div>
  );
}

//
// NOTIFICATION SETTINGS
//
function NotificationSettings() {
  const [noti, setNoti] = useState({
    email: false,
    courseUpdates: false,
    announcements: false,
    marketing: false,
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 1️⃣ FETCH NOTIFICATION SETTINGS FROM BACKEND
  useEffect(() => {
    const fetchNoti = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.user.notifications) {
          setNoti(res.data.user.notifications);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load notification settings");
      } finally {
        setLoading(false);
      }
    };

    fetchNoti();
  }, [token]);

  // 2️⃣ SAVE NOTIFICATION SETTINGS TO BACKEND
  const savePreferences = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-notifications`,
        { notifications: noti },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Notification preferences updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save preferences");
    }
  };

  if (loading) return <p>Loading preferences...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        <Toggle
          label="Email Notifications"
          value={noti.email}
          onChange={(v) => setNoti({ ...noti, email: v })}
        />

        <Toggle
          label="Course Updates"
          value={noti.courseUpdates}
          onChange={(v) => setNoti({ ...noti, courseUpdates: v })}
        />

        <Toggle
          label="New Announcements"
          value={noti.announcements}
          onChange={(v) => setNoti({ ...noti, announcements: v })}
        />

        <Toggle
          label="Marketing Messages"
          value={noti.marketing}
          onChange={(v) => setNoti({ ...noti, marketing: v })}
        />
      </div>

      <button
        onClick={savePreferences}
        className="w-full md:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Save Preferences
      </button>
    </div>
  );
}

//
// CHANGE PASSWORD TAB
//
// Replace your existing ChangePassword() with this:
function ChangePassword() {
  const [pass, setPass] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setPass({ ...pass, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!pass.currentPassword || !pass.newPassword || !pass.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (pass.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (pass.newPassword !== pass.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/updatePassword`,
        {
          currentPassword: pass.currentPassword,
          newPassword: pass.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data?.message || "Password updated successfully");
      setPass({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      if (err?.response?.status === 400) {
        const msg = err.response.data?.message || "Wrong current password";
        toast.error(msg);
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update password");
      }
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <InputField
          type="password"
          name="currentPassword"
          label="Current Password"
          value={pass.currentPassword}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="newPassword"
          label="New Password"
          value={pass.newPassword}
          onChange={handleChange}
        />

        <InputField
          type="password"
          name="confirmPassword"
          label="Confirm New Password"
          value={pass.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full md:w-auto px-5 py-2 rounded-xl transition ${
          loading
            ? "bg-gray-400 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}

//
// INPUT FIELD
//
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

//
// TOGGLE SWITCH
//
function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
      <p className="text-gray-800 text-sm">{label}</p>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />

        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>

        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-5"></div>
      </label>
    </div>
  );
}
