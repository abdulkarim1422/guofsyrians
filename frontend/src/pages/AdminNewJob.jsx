import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";
import { jobsAPI } from "../utils/api";

export default function AdminNewJob({ onSidebarHide }) {
  const nav = useNavigate();
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    type: "full-time",
    salary: "",
    remote: false,
    description: "",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
    contactEmail: "",
    isActive: true,
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobs();
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.description.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);
      if (editingJob) {
        await jobsAPI.updateJob(editingJob._id, jobForm);
        alert("تم تحديث الوظيفة بنجاح");
      } else {
        await jobsAPI.createJob(jobForm);
        alert("تم إنشاء الوظيفة بنجاح");
      }
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      alert("حدث خطأ في حفظ الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setJobForm({
      title: "",
      location: "",
      type: "full-time",
      salary: "",
      remote: false,
      description: "",
      requirements: "",
      benefits: "",
      applicationDeadline: "",
      contactEmail: "",
      isActive: true,
    });
    setEditingJob(null);
  };

  const handleEdit = (job) => {
    setJobForm({
      title: job.title || "",
      location: job.location || "",
      type: job.type || "full-time",
      salary: job.salary || "",
      remote: job.remote || false,
      description: job.description || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : "",
      contactEmail: job.contactEmail || "",
      isActive: job.isActive !== undefined ? job.isActive : true,
    });
    setEditingJob(job);
  };

  const handleDelete = async (jobId) => {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;

    try {
      setLoading(true);
      await jobsAPI.deleteJob(jobId);
      alert("تم حذف الوظيفة بنجاح");
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("حدث خطأ في حذف الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    try {
      setLoading(true);
      await jobsAPI.updateJob(job._id, { ...job, isActive: !job.isActive });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("حدث خطأ في تحديث حالة الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 ml-0 sm:ml-20 xl:ml-60 overflow-hidden bg-gray-50" dir="rtl">
      <div className="bg-[#ede3cf]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            إدارة الوظائف
          </h1>
          <p className="text-gray-700 mt-2">
            أنشئ وظائف جديدة أو عدّل الوظائف الحالية — وستظهر مباشرة ضمن صفحة الإعلانات.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingJob ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان الوظيفة *
                </label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع
                </label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الوظيفة
                </label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">دوام كامل</option>
                  <option value="part-time">دوام جزئي</option>
                  <option value="contract">عقد</option>
                  <option value="internship">تدريب</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الراتب
                </label>
                <input
                  type="text"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 5000-8000 ريال"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remote"
                  checked={jobForm.remote}
                  onChange={(e) => setJobForm({ ...jobForm, remote: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                  عمل عن بُعد
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وصف الوظيفة *
                </label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المتطلبات
                </label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المزايا
                </label>
                <textarea
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آخر موعد للتقديم
                </label>
                <input
                  type="date"
                  value={jobForm.applicationDeadline}
                  onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني للتواصل
                </label>
                <input
                  type="email"
                  value={jobForm.contactEmail}
                  onChange={(e) => setJobForm({ ...jobForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={jobForm.isActive}
                  onChange={(e) => setJobForm({ ...jobForm, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  وظيفة نشطة
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "جاري الحفظ..." : editingJob ? "تحديث الوظيفة" : "إضافة الوظيفة"}
                </button>
                {editingJob && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">الوظائف الحالية</h2>
            {loading && jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد وظائف مضافة بعد</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{job.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className={clsx(
                            "text-sm",
                            job.isActive
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-green-600 hover:text-green-800"
                          )}
                        >
                          {job.isActive ? "إيقاف" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {job.location} • {job.type === "full-time" ? "دوام كامل" : 
                        job.type === "part-time" ? "دوام جزئي" : 
                        job.type === "contract" ? "عقد" : "تدريب"}
                      {job.remote && " • عن بُعد"}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs",
                        job.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {job.isActive ? "نشطة" : "متوقفة"}
                      </span>
                      {job.salary && (
                        <span className="text-sm text-gray-600">{job.salary}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
