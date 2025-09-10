// src/pages/AdminJobsManage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { jobsAPI } from "@/utils/api";
import { Link } from "react-router-dom";

export default function AdminJobsManage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | inactive

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params =
        filter === "active" ? { is_active: true, limit: 100 } :
        filter === "inactive" ? { is_active: false, limit: 100 } :
        { limit: 100 };
      const list = await jobsAPI.list(params);
      const normalized = (list || []).map(j => ({ ...j, id: j.id ?? j._id ?? "" }));
      setRows(normalized);
    } catch (e) {
      console.error("Load jobs failed:", e);
      setError(e?.response?.data?.detail || e?.message || "فشل تحميل الوظائف");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const toast = (msg) => window.alert(msg);

  const toggleActive = async (job) => {
    setBusyId(job.id);
    try {
      const updated = await jobsAPI.update(job.id, { is_active: !job.is_active });
      setRows(prev => prev.map(j => (j.id === job.id ? { ...j, ...updated } : j)));
      toast(updated.is_active ? "تم تشغيل الوظيفة ✅" : "تم إيقاف الوظيفة ✅");
      // لو كنت على تبويب "غير نشطة" وفعلتها، هتختفي من القائمة (وهذا منطقي)
    } catch (e) {
      console.error("Toggle active failed:", e);
      const msg = e?.response?.status === 401
        ? "انتهت الجلسة أو الصلاحيات غير كافية (401). سجّل الدخول كأدمن."
        : e?.response?.data?.detail || e?.message || "فشل تغيير حالة الوظيفة";
      toast(msg);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm("حذف هذه الوظيفة؟")) return;
    setBusyId(id);
    try {
      await jobsAPI.remove(id);
      setRows(prev => prev.filter(j => j.id !== id));
      toast("تم حذف الوظيفة ✅");
    } catch (e) {
      console.error("Delete job failed:", e);
      const s = e?.response?.status;
      const msg =
        s === 401 ? "انتهت الجلسة أو الصلاحيات غير كافية (401)" :
        s === 404 ? "الوظيفة غير موجودة (404)" :
        e?.response?.data?.detail || e?.message || "فشل حذف الوظيفة";
      toast(msg);
    } finally {
      setBusyId(null);
    }
  };

  const applicantsKey = useMemo(
    () => ["applicants_count", "applications_count", "applied_count"]
      .find(k => rows?.[0]?.[k] !== undefined),
    [rows]
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#214937]">إدارة الوظائف</h1>
        <Link
          to="/admin/jobs/new"
          className="px-4 py-2 rounded-lg bg-[#295a45] hover:bg-[#214937] text-white font-medium"
        >
          + وظيفة جديدة
        </Link>
      </div>

      {/* فلاتر */}
      <div className="mb-4 flex gap-2">
        {["all","active","inactive"].map(v=>{
          const active = filter === v;
          const label = v==="all"?"الكل": v==="active"?"نشطة":"غير نشطة";
          return (
            <button key={v}
              onClick={()=>setFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-sm ${active?"bg-blue-100 text-blue-800 border border-blue-200":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div>جاري التحميل…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-right text-gray-700">
                <th className="p-3">المسمّى</th>
                <th className="p-3">الشركة</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">المتقدّمون</th>
                <th className="p-3">حد المتقدمين</th>
                <th className="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="p-3">{job.title}</td>
                  <td className="p-3">{job.company}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${job.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {job.is_active ? "نشط" : "متوقف"}
                    </span>
                  </td>
                  <td className="p-3">{job[applicantsKey] ?? 0}</td>
                  <td className="p-3">
                    {job.max_applicants == null ? "غير محدود" : job.max_applicants}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => toggleActive(job)}
                      disabled={busyId === job.id}
                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white"
                    >
                      {busyId === job.id ? "..." : job.is_active ? "إيقاف" : "تشغيل"}
                    </button>
                    <Link
                      to={`/admin/jobs/new?id=${job.id}`}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      تعديل
                    </Link>
                    <button
                      onClick={() => remove(job.id)}
                      disabled={busyId === job.id}
                      className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white"
                    >
                      {busyId === job.id ? "..." : "حذف"}
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    لا توجد وظائف في هذا الفلتر
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        ملاحظة: لو عندك حد أقصى للمتقدمين، يفضّل إيقاف الوظيفة تلقائيًا من الباك عند الوصول للعدد.
      </p>
    </div>
  );
}
