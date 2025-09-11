import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { jobsAPI } from "../utils/api";
import { AttributionComponent } from "@/components/dashboard-components/attribution.jsx";

/** نفس عناصر السايدبار حق الداشبورد */
const sidebarItems = [
  [
    { id: "0", title: "Dashboard" },
    { id: "1", title: "Students list" },
    { id: "5", title: "Edit Resume" },
  ],
  [
    { id: "2", title: "Settings" },
    { id: "3", title: "Announcements" },
    { id: "4", title: "About" },
  ],
];

export default function AdminNewJob() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const selectedPage = (() => {
    switch (loc.pathname) {
      case "/":
      case "/dashboard": return "0";
      case "/students-list": return "1";
      case "/settings": return "2";
      case "/announcements": return "3";
      case "/about": return "4";
      case "/edit-resume": return "5";
      default: return "0";
    }
  })();

  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ---- إدارة القائمة و النموذج (إنشاء/تعديل) ----
  const emptyForm = {
    title: "",
    company: "",
    location: "",
    city: "",
    nature_of_work: "administrative",
    employment_type: "full_time",
    workplace_type: "onsite",
    description: "",
    requirements: "",
    is_active: true,
    unlimited_applicants: true,
    max_applicants: "",
  };  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const list = await jobsAPI.list();
      setRows(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toPayload = (f) => ({
    title: f.title,
    company: f.company,
    location: f.location,
    city: f.city,
    nature_of_work: f.nature_of_work,
    employment_type: f.employment_type,
    workplace_type: f.workplace_type,
    description: f.description,
    requirements: f.requirements,
    is_active: !!f.is_active,
    // لو غير محدود: null — لا ترسل رقم
    max_applicants: f.unlimited_applicants ? null :
      (f.max_applicants === "" ? null : Number(f.max_applicants)),
  });

  const resetForm = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const fillFormForEdit = (job) => {
    setEditId(job.id);
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      city: job.city || "",
      nature_of_work: job.nature_of_work || "administrative",
      employment_type: job.employment_type || job.type || "full_time",
      workplace_type: job.workplace_type || "onsite",
      description: job.description || "",
      requirements: job.requirements || "",
      is_active: !!job.is_active,
      unlimited_applicants: job.max_applicants == null,
      max_applicants: job.max_applicants ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPageSelect = (id) => {
    switch (id) {
      case "0": nav("/dashboard"); break;
      case "1": nav("/students-list"); break;
      case "2": nav("/settings"); break;
      case "3": nav("/announcements"); break;
      case "4": nav("/about"); break;
      case "5": nav("/edit-resume"); break;
      default: nav("/dashboard");
    }
    setShowSidebar(false);
  };

  const afterWrite = async () => {
    await load();          // حدّث الجدول
    nav("/announcements"); // حتى تظهر الوظيفة فورًا هناك
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    try {
      setSaving(true);
      const payload = toPayload(form);
      if (editId) {
        await jobsAPI.update(editId, payload);
      } else {
        await jobsAPI.create(payload);
      }
      resetForm();
      await afterWrite();
    } catch (err) {
      const res = err?.response;
      const detail = res?.data?.detail ?? res?.data ?? err?.message;
      console.error('Create/Update job failed:', res?.data || err);
      alert(`فشل حفظ الوظيفة:\n${typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2)}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("حذف هذه الوظيفة؟")) return;
    try {
      await jobsAPI.remove(id);
      if (editId === id) resetForm();
      await afterWrite();
    } catch (err) {
      console.error(err);
      alert("فشل حذف الوظيفة");
    }
  };

  const toggleActive = async (job) => {
    try {
      await jobsAPI.update(job.id, { is_active: !job.is_active });
      await load();
    } catch (e) {
      alert("تعذّر تغيير الحالة");
    }
  };

  const applicantsKey = useMemo(
    () => ["applicants_count", "applications_count", "applied_count"].find(k => rows?.[0]?.[k] !== undefined),
    [rows]
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative" dir="rtl">
      {showSidebar && (
        <button
          aria-label="Close sidebar"
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/20 sm:hidden z-40"
        />
      )}

      <Sidebar
        onSidebarHide={() => setShowSidebar(false)}
        showSidebar={showSidebar}
        selectedPage={selectedPage}
        onPageSelect={onPageSelect}
        user={user}
        onLogout={() => { logout(); nav("/login"); }}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        navigate={nav}
        setShowSidebar={setShowSidebar}
      />

      <div className="flex-1 ml-0 sm:ml-20 xl:ml-60">
        {/* شريط علوي */}
        <div className="bg-[#ede3cf]">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-gray-900">
              {editId ? "تعديل وظيفة" : "إضافة وظيفة جديدة"}
            </h1>
            <p className="text-gray-700 mt-2">
              أنشئ وظائف جديدة أو عدّل الوظائف الحالية — وستظهر مباشرة ضمن صفحة الإعلانات.
            </p>
          </div>
        </div>

        <div className="-mt-6 px-4 pb-12">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-6">
            {/* جدول الإدارة */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-[#214937]">إدارة الوظائف</h2>
                  <div className="flex gap-2">
                    <button onClick={resetForm}
                            className="px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
                      + إضافة جديدة
                    </button>
                    <Link to="/announcements"
                          className="px-3 py-2 rounded-xl bg-[#295a45] text-white hover:bg-[#214937]">
                      عرض الإعلانات
                    </Link>
                  </div>
                </div>

                {loading ? (
                  <div className="p-6 text-center text-gray-500">جاري التحميل…</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-right text-gray-700">
                          <th className="p-3">المسمّى</th>
                          <th className="p-3">الشركة</th>
                          <th className="p-3">الحالة</th>
                          <th className="p-3">المتقدّمون</th>
                          <th className="p-3">حد المتقدّمين</th>
                          <th className="p-3">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(job => (
                          <tr key={job.id} className="border-t">
                            <td className="p-3">{job.title}</td>
                            <td className="p-3">{job.company}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded ${job.is_active ? "bg-green-100 text-green-700":"bg-gray-200 text-gray-700"}`}>
                                {job.is_active ? "نشط" : "متوقف"}
                              </span>
                            </td>
                            <td className="p-3">
                              {job[applicantsKey] ?? 0}
                            </td>
                            <td className="p-3">
                              {job.max_applicants == null ? "غير محدود" : job.max_applicants}
                            </td>
                            <td className="p-3 flex gap-2 flex-wrap">
                              <button onClick={() => toggleActive(job)}
                                      className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white">
                                {job.is_active ? "إيقاف" : "تفعيل"}
                              </button>
                              <button onClick={() => fillFormForEdit(job)}
                                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white">
                                تعديل
                              </button>
                              <button onClick={() => remove(job.id)}
                                      className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white">
                                حذف
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  تلميح: إذا عيّنت حدًا أقصى للمتقدّمين، من الأفضل أن يوقف الباك الوظيفة تلقائيًا عند الوصول للحد.
                </p>
              </div>
            </div>

            {/* نموذج الإنشاء/التعديل */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                <form onSubmit={submit} className="space-y-6" dir="rtl">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="المسمى الوظيفي" required value={form.title}
                           onChange={(v) => setForm({ ...form, title: v })} />
                    <Field label="الشركة" required value={form.company}
                           onChange={(v) => setForm({ ...form, company: v })} />
                  </div>

                  <div className="grid md:grid-cols-3 gap-5">
                    <Field label="الموقع" value={form.location}
                           onChange={(v) => setForm({ ...form, location: v })} />
                    <SelectField
                      label="مدينة العمل"
                      value={form.city}
                      onChange={(v) => setForm({ ...form, city: v })}
                      options={[
                        { v: "Istanbul", t: "اسطنبول" },
                        { v: "Ankara", t: "أنقرة" },
                        { v: "Izmir", t: "إزمير" },
                        { v: "Bursa", t: "بورصة" },
                        { v: "Adana", t: "أضنة" },
                        { v: "Gaziantep", t: "غازي عنتاب" },
                        { v: "Konya", t: "قونيا" },
                        { v: "Antalya", t: "أنطاليا" },
                        { v: "Kayseri", t: "قيصري" },
                        { v: "Mersin", t: "مرسين" },
                        { v: "Other", t: "أخرى" },
                      ]}
                    />
                    <SelectField
                      label="طبيعة العمل"
                      value={form.nature_of_work}
                      onChange={(v) => setForm({ ...form, nature_of_work: v })}
                      options={[
                        { v: "administrative", t: "إداري" },
                        { v: "fieldwork", t: "ميداني" },
                        { v: "remote", t: "عن بُعد" },
                        { v: "technical", t: "تقني" },
                        { v: "creative", t: "إبداعي" },
                        { v: "analytical", t: "تحليلي" },
                        { v: "sales", t: "مبيعات" },
                        { v: "support", t: "دعم" },
                      ]}
                    />
                    <SelectField
                      label="نوع الدوام"
                      value={form.employment_type}
                      onChange={(v) => setForm({ ...form, employment_type: v })}
                      options={[
                        { v: "full_time", t: "دوام كامل" },
                        { v: "part_time", t: "دوام جزئي" },
                        { v: "internship", t: "تدريب" },
                        { v: "contract", t: "عقد" },
                        { v: "temporary", t: "مؤقت" },
                        { v: "freelance", t: "عمل حر" },
                      ]}
                    />
                    <SelectField
                      label="نمط العمل (شكلي)"
                      value={form.workplace_type}
                      onChange={(v) => setForm({ ...form, workplace_type: v })}
                      options={[
                        { v: "onsite", t: "حضوري" },
                        { v: "remote", t: "عن بعد" },
                        { v: "hybrid", t: "هجين" },
                      ]}
                    />
                  </div>

                  <TextArea label="الوصف" required rows={5}
                            value={form.description}
                            onChange={(v) => setForm({ ...form, description: v })} />

                  <TextArea label="المتطلبات (سطور منفصلة)" rows={6}
                            value={form.requirements}
                            onChange={(v) => setForm({ ...form, requirements: v })} />

                  {/* حد المتقدمين */}
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="flex items-center gap-3">
                      <input
                        id="unlimited_applicants"
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                        checked={form.unlimited_applicants}
                        onChange={(e) => setForm({ ...form, unlimited_applicants: e.target.checked })}
                      />
                      <label htmlFor="unlimited_applicants" className="text-sm text-gray-700">
                        عدد المتقدّمين غير محدّد
                      </label>
                    </div>

                    <Field
                      label="تحديد عدد المتقدّمين (اختياري)"
                      type="number"
                      min={1}
                      value={form.unlimited_applicants ? "" : form.max_applicants}
                      onChange={(v) => setForm({ ...form, max_applicants: v })}
                      placeholder="مثال: 50"
                      disabled={form.unlimited_applicants}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input id="is_active" type="checkbox"
                           className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                           checked={form.is_active}
                           onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label htmlFor="is_active" className="text-sm text-gray-700">نشط (ظاهر للمتقدمين)</label>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-500">
                      {editId ? `تحرير الوظيفة #${editId}` : "إنشاء وظيفة جديدة"}
                    </div>
                    <div className="flex gap-2">
                      {editId && (
                        <button type="button" onClick={() => remove(editId)}
                                className="px-4 py-2 rounded-2xl bg-rose-600 text-white hover:bg-rose-700">
                          حذف
                        </button>
                      )}
                      <button type="button" onClick={() => nav("/announcements")}
                              className="px-4 py-2 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50">
                        إلغاء
                      </button>
                      <button type="submit" disabled={saving}
                              className="px-5 py-2.5 rounded-2xl bg-[#295a45] text-white hover:bg-[#214937] disabled:opacity-60">
                        {saving ? "جاري الحفظ..." : (editId ? "حفظ التعديلات" : "حفظ ونشر")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- عناصر UI بسيطة ---------- */
function Field({ label, value, onChange, type = "text", required, placeholder, min, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        min={min}
        disabled={disabled}
        className={clsx(
          "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600",
          disabled && "bg-gray-100 cursor-not-allowed"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.t}</option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 placeholder:text-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

/* ---------- Sidebar (مطابق للداشبورد) ---------- */
function Sidebar({
  onSidebarHide,
  showSidebar,
  selectedPage,
  onPageSelect,
  user,
  onLogout,
  showUserMenu,
  setShowUserMenu,
  navigate,
  setShowSidebar,
}) {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 bg-card w-72 sm:w-20 xl:w-60 sm:flex flex-col shadow-lg",
        showSidebar ? "flex" : "hidden"
      )}
    >
      <div className="flex-shrink-0 overflow-hidden p-2">
        <div
          className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-top"
          onClick={() => { navigate("/dashboard"); setShowSidebar(false); }}
          style={{ cursor: "pointer" }}
        >
          <div className="w-full flex justify-center items-center">
            <img src="/favicon.png" alt="Logo" style={{ width: 100, height: 100, marginBottom: -10, marginTop: -10 }} />
          </div>
          <div className="flex-grow sm:hidden xl:block" />
          <IconButton icon="res-react-dash-sidebar-close" className="block sm:hidden" onClick={onSidebarHide} />
        </div>
      </div>

      <div className="flex-grow overflow-x-hidden overflow-y-auto flex flex-col">
        <div className="w-full p-3 h-24 sm:h-20 xl:h-24 hidden sm:block flex-shrink-0">
          <div className="bg-sidebar-card-top rounded-xl w-full h-full flex items-center justify-start sm:justify-center xl:justify-start px-3 sm:px-0 xl:px-3">
            <div className="bg-white rounded-2xl">
              <img src="/favicon.png" alt="Logo" style={{ width: 75, height: 50 }} />
            </div>
            <div className="block sm:hidden xl:block ml-3">
              <div className="text-sm font-bold white">الاتّحاد العام</div>
              <div className="text-sm">سيتم إضافة بقيّة الاتّحادات لاحقاً</div>
            </div>
            <div className="block sm:hidden xl:block flex-grow" />
            <Icon path="res-react-dash-sidebar-card-select" className="block sm:hidden xl:block w-5 h-5" />
          </div>
        </div>

        {sidebarItems[0].map((i) => (
          <MenuItem key={i.id} item={i} onClick={onPageSelect} selected={selectedPage} />
        ))}

        <Link
          to="/admin/jobs/new"
          onClick={() => setShowSidebar(false)}
          className={clsx(
            "w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3",
            "cursor-pointer sidebar-item select-none gap-2 py-2"
          )}
        >
          <svg className="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M10 4h4a2 2 0 012 2v1h2.5A1.5 1.5 0 0120 8.5v9A1.5 1.5 0 0118.5 19h-13A1.5 1.5 0 014 17.5v-9A1.5 1.5 0 015.5 6H8V6a2 2 0 012-2zm0 2v1h4V6h-4z" />
          </svg>
          <span className="block sm:hidden xl:block">إضافة وظيفة</span>
          <div className="block sm:hidden xl:block flex-grow" />
        </Link>

        <div className="mt-8 mb-0 font-bold px-3 block sm:hidden xl:block">SHORTCUTS</div>
        {sidebarItems[1].map((i) => (
          <MenuItem key={i.id} item={i} onClick={onPageSelect} selected={selectedPage} />
        ))}
        <div className="flex-grow" />
      </div>

      <AttributionComponent />

      <div className="flex-shrink-0 p-2 relative user-menu-container">
        <div
          className="flex items-center h-full sm:justify-center xl:justify-start p-2 sidebar-separator-bottom cursor-pointer hover:bg-gray-700/50 rounded-lg transition-colors"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="block sm:hidden xl:block ml-2">
            <div className="font-bold dashboard-username text-sm">{user?.name || "User"}</div>
            <div className="text-xs dashboard-user-role">{user?.role || "member"}</div>
          </div>
          <div className="flex-grow block sm:hidden xl:block" />
          <div className="block sm:hidden xl:block w-6 h-6 text-gray-400 hover:text-white transition-colors">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {showUserMenu && (
          <div className="absolute left-2 right-2 bottom-16 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-[1000] min-w-[260px]">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${user ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-white text-xs font-medium">
                  {user ? "Authenticated" : "Not Authenticated"}
                </span>
              </div>
              {user && (
                <div className="text-xs text-gray-300 space-y-1">
                  <div>ID: {user.id}</div>
                  <div>Email: {user.email}</div>
                  <div>Active: {user.is_active ? "Yes" : "No"}</div>
                  <div>Verified: {user.is_verified ? "Yes" : "No"}</div>
                </div>
              )}
            </div>
            <div className="p-2">
              <button
                onClick={() => { navigate("/profile"); setShowSidebar(false); }}
                className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                onClick={onLogout}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function MenuItem({ item: { id, title }, onClick, selected }) {
  return (
    <button
      type="button"
      className={clsx(
        "w-full mt-6 flex items-center px-3 sm:px-0 xl:px-3 justify-start sm:justify-center xl:justify-start sm:mt-6 xl:mt-3 cursor-pointer select-none py-2",
        selected === id ? "sidebar-item-selected" : "sidebar-item"
      )}
      onClick={() => onClick(id)}
    >
      <SidebarIcons id={id} />
      <span className="block sm:hidden xl:block ml-2">{title}</span>
      <span className="block sm:hidden xl:block flex-grow" />
    </button>
  );
}

function SidebarIcons({ id }) {
  const icons = {
    0: (<><path d="M12 19C10.067 19 8.31704 18.2165 7.05029 16.9498L12 12V5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z" /><path fillRule="evenodd" clipRule="evenodd" d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" /></>),
    1: (<><path fillRule="evenodd" clipRule="evenodd" d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z" /></>),
    2: (<><path d="M2 4V18L6.8 14.4C7.14582 14.1396 7.56713 13.9992 8 14H16C17.1046 14 18 13.1046 18 12V4C18 2.89543 17.1046 2 16 2H4C2.89543 2 2 2.89543 2 4ZM4 14V4H16V12H7.334C6.90107 11.9988 6.47964 12.1393 6.134 12.4L4 14Z" /><path d="M22 22V9C22 7.89543 21.1046 7 20 7V18L17.866 16.4C17.5204 16.1393 17.0989 15.9988 16.666 16H7C7 17.1046 7.89543 18 9 18H16C16.4329 17.9992 16.8542 18.1396 17.2 18.4L22 22Z" /></>),
    3: (<><path d="M9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3ZM6 8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8C12 9.65685 10.6569 11 9 11C7.34315 11 6 9.65685 6 8Z" /><path d="M16.9084 8.21828C16.6271 8.07484 16.3158 8.00006 16 8.00006V6.00006C16.6316 6.00006 17.2542 6.14956 17.8169 6.43645C17.8789 6.46805 17.9399 6.50121 18 6.5359C18.4854 6.81614 18.9072 7.19569 19.2373 7.65055C19.6083 8.16172 19.8529 8.75347 19.9512 9.37737C20.0496 10.0013 19.9987 10.6396 19.8029 11.2401C19.6071 11.8405 19.2719 12.3861 18.8247 12.8321C18.3775 13.2782 17.8311 13.6119 17.2301 13.8062C16.6953 13.979 16.1308 14.037 15.5735 13.9772C15.5046 13.9698 15.4357 13.9606 15.367 13.9496C14.7438 13.8497 14.1531 13.6038 13.6431 13.2319L13.6421 13.2311L14.821 11.6156C15.0761 11.8017 15.3717 11.9248 15.6835 11.9747C15.9953 12.0247 16.3145 12.0001 16.615 11.903C16.9155 11.8059 17.1887 11.639 17.4123 11.416C17.6359 11.193 17.8035 10.9202 17.9014 10.62C17.9993 10.3198 18.0247 10.0006 17.9756 9.68869C17.9264 9.37675 17.8041 9.08089 17.6186 8.82531C17.4331 8.56974 17.1898 8.36172 16.9084 8.21828Z" /><path d="M19.9981 21C19.9981 20.475 19.8947 19.9551 19.6938 19.47C19.4928 18.9849 19.1983 18.5442 18.8271 18.1729C18.4558 17.8017 18.0151 17.5072 17.53 17.3062C17.0449 17.1053 16.525 17.0019 16 17.0019V15C16.6821 15 17.3584 15.1163 18 15.3431C18.0996 15.3783 18.1983 15.4162 18.2961 15.4567C19.0241 15.7583 19.6855 16.2002 20.2426 16.7574C20.7998 17.3145 21.2417 17.9759 21.5433 18.7039C21.5838 18.8017 21.6217 18.9004 21.6569 19C21.8837 19.6416 22 20.3179 22 21H19.9981Z" /><path d="M16 21H14C14 18.2386 11.7614 16 9 16C6.23858 16 4 18.2386 4 21H2C2 17.134 5.13401 14 9 14C12.866 14 16 17.134 16 21Z" /></>),
    4: (<><path d="M19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H7V2H9V4H15V2H17V4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22ZM5 10V20H19V10H5ZM5 6V8H19V6H5ZM17 14H7V12H17V14Z" /></>),
    5: (<><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" /><path d="M8 12H16V14H8V12Z" /><path d="M8 16H13V18H8V16Z" /></>),
  };
  return (
    <svg className="w-8 h-8 xl:w-5 xl:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {icons[id]}
    </svg>
  );
}

function Icon({ path = "options", className = "w-4 h-4" }) {
  return <img src={`https://assets.codepen.io/3685267/${path}.svg`} alt="" className={clsx(className)} />;
}

function IconButton({ onClick = () => {}, icon = "options", className = "w-4 h-4" }) {
  return (
    <button onClick={onClick} type="button" className={className}>
      <img src={`https://assets.codepen.io/3685267/${icon}.svg`} alt="" className="w-full h-full" />
    </button>
  );
}
