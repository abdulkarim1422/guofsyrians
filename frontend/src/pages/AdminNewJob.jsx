import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { jobsAPI } from "../utils/api";

export default function AdminNewJob() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

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
      <div className="flex-1">
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
