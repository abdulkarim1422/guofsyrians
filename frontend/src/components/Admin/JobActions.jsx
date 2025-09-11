// frontend/src/components/Admin/JobActions.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jobsAPI } from "@/utils/api";

/**
 * أزرار إدارة إعلان وظيفة (تشغيل/إيقاف - تعديل - حذف)
 */
export default function JobActions({
  job,
  onChanged = () => {},
  size = "md",
  editHrefBuilder = (id) => `/admin/jobs/new?id=${id}`,
  showEdit = true,
}) {
  const [busy, setBusy] = useState(false);

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm",
  };
  const cls = sizes[size] || sizes.md;

  const handleToggle = async () => {
    if (!job?.id) return;
    try {
      setBusy(true);
      await jobsAPI.update(job.id, { is_active: !job.is_active });
      onChanged();
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.detail ||
        e?.message ||
        "فشل تغيير حالة الوظيفة. تأكد من تسجيل الدخول كأدمن."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!job?.id) return;
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    try {
      setBusy(true);
      await jobsAPI.remove(job.id);
      onChanged();
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.detail ||
        e?.message ||
        "فشل حذف الوظيفة. تأكد من تسجيل الدخول كأدمن."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={busy}
        className={`${cls} rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white`}
        title={job?.is_active ? "إيقاف" : "تشغيل"}
      >
        {job?.is_active ? "إيقاف" : "تشغيل"}
      </button>

      {showEdit && (
        <Link
          to={editHrefBuilder(job?.id)}
          className={`${cls} rounded bg-amber-500 hover:bg-amber-600 text-white`}
          title="تعديل"
        >
          تعديل
        </Link>
      )}

      <button
        onClick={handleDelete}
        disabled={busy}
        className={`${cls} rounded bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white`}
        title="حذف"
      >
        حذف
      </button>
    </div>
  );
}
