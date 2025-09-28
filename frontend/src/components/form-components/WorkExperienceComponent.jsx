import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Building, User, CheckCircle, Award } from 'lucide-react';

const WorkExperienceComponent = ({ formData, setFormData }) => {
  const [workExperiences, setWorkExperiences] = useState([]);

  // Initialize work experiences from formData
  useEffect(() => {
    if (formData.works && formData.works.length > 0) {
      // Ensure required fields exist
      setWorkExperiences(formData.works.map(w => ({
        title: w.title || '',
        company: w.company || '',
        start_date: w.start_date || '',
        end_date: w.end_date || '',
        currently_working: w.currently_working || false,
        period: w.period || '',
        responsibilities: w.responsibilities || '',
        achievements: w.achievements || '',
        description: Array.isArray(w.description) ? w.description : (w.description ? [w.description] : []),
      })));
    } else {
      setWorkExperiences([{
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        currently_working: false,
        period: '',
        responsibilities: '',
        achievements: '',
        description: []
      }]);
    }
  }, [formData.works]); // re-sync when upstream formData.works changes

  const addWorkExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      currently_working: false,
      period: '',
      responsibilities: '',
      achievements: '',
      description: []
    };
    const updatedExperiences = [...workExperiences, newExperience];
    setWorkExperiences(updatedExperiences);
    setFormData(prev => ({
      ...prev,
      works: updatedExperiences
    }));
  };

  const removeWorkExperience = (index) => {
    if (workExperiences.length > 1) {
      const updated = workExperiences.filter((_, i) => i !== index);
      setWorkExperiences(updated);
      setFormData(prev => ({
        ...prev,
        works: updated
      }));
    }
  };

  const formatPeriod = (start_date, end_date, currently_working) => {
    if (!start_date) return '';
    const fmt = (d) => {
      if (!d) return '';
      const date = new Date(d);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };
    const s = fmt(start_date);
    if (currently_working) return `${s} - حالياً`;
    if (end_date) {
      const e = fmt(end_date);
      return e ? `${s} - ${e}` : s;
    }
    return s;
  };

  const updateWorkExperience = (index, field, value) => {
    const updated = workExperiences.map((work, i) => {
      if (i !== index) return work;
      const next = { ...work, [field]: value };
      if (['start_date', 'end_date', 'currently_working'].includes(field)) {
        next.period = formatPeriod(next.start_date, next.end_date, next.currently_working);
        if (field === 'currently_working' && value) {
          // Clear end date when marked currently working
            next.end_date = '';
        }
      }
      return next;
    });
    setWorkExperiences(updated);
    setFormData(prev => ({
      ...prev,
      works: updated
    }));
  };

  // legacy validator removed (auto period computation now)

  const isFormValid = () => {
    return workExperiences.every(work => 
      work.title.trim() !== '' && 
      work.company.trim() !== '' &&
      work.responsibilities.trim() !== '' &&
      work.responsibilities.trim().length >= 10
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-carbon flex items-center">
            <Building className="w-6 h-6 mr-2 text-rich-gold" />
            الخبرة العملية
          </h2>
          <button
            type="button"
            onClick={addWorkExperience}
            className="bg-rich-gold hover:bg-gold-dark text-deep-green px-4 py-2 rounded-lg flex items-center transition-colors font-medium hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة خبرة
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          شارك رحلتك المهنية. افصل مسؤولياتك الأساسية عن إنجازاتك لتأثير أفضل.
        </p>
      </div>

      <div className="space-y-6">
        {workExperiences.map((work, index) => (
          <div key={index} className="p-6 bg-sand rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-carbon flex items-center">
                <User className="w-5 h-5 mr-2 text-rich-gold" />
                الخبرة العملية #{index + 1}
              </h3>
              {workExperiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkExperience(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors hover:shadow-md"
                  title="إزالة هذه الخبرة العملية"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">
                  المسمى الوظيفي *
                </label>
                <input
                  type="text"
                  value={work.title}
                  onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  placeholder="مثال: مهندس برمجيات أول، مدير تسويق"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">
                  الشركة *
                </label>
                <input
                  type="text"
                  value={work.company}
                  onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  placeholder="مثال: جوجل، مايكروسوفت، شركة محلية"
                  required
                />
              </div>
            </div>

            {/* Employment Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-carbon mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  تاريخ البدء *
                </label>
                <input
                  type="date"
                  value={work.start_date}
                  onChange={(e) => updateWorkExperience(index, 'start_date', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                  required
                />
              </div>
              {!work.currently_working && (
                <div>
                  <label className="block text-sm font-medium text-carbon mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={work.end_date}
                    onChange={(e) => updateWorkExperience(index, 'end_date', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
                    min={work.start_date || undefined}
                  />
                </div>
              )}
              <div className="flex items-center mt-6 space-x-2">
                <input
                  id={`currently_working_${index}`}
                  type="checkbox"
                  checked={work.currently_working}
                  onChange={(e) => updateWorkExperience(index, 'currently_working', e.target.checked)}
                  className="h-5 w-5 text-rich-gold focus:ring-rich-gold border-gray-300 rounded"
                />
                <label htmlFor={`currently_working_${index}`} className="text-sm text-carbon">
                  أعمل هنا حالياً
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-carbon mb-1">الفترة المحسوبة</label>
              <input
                type="text"
                value={work.period}
                readOnly
                className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 text-carbon rounded-lg text-sm"
                placeholder="يتم إنشاؤها تلقائياً بعد اختيار التواريخ"
              />
              <p className="text-xs text-gray-500 mt-1">يتم إرسال هذه القيمة إلى الخلفية للتوافق مع الإصدارات السابقة.</p>
            </div>

            {/* Responsibilities */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-carbon mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                المسؤوليات الأساسية *
              </label>
              <textarea
                value={work.responsibilities}
                onChange={(e) => updateWorkExperience(index, 'responsibilities', e.target.value)}
                className={`w-full px-4 py-3 bg-white border-2 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none ${
                  work.responsibilities.trim().length > 0 && work.responsibilities.trim().length < 10
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-200'
                }`}
                rows="4"
                placeholder="اوصف واجباتك ومسؤولياتك الرئيسية في هذا الدور. كن محدداً حول ما فعلته يومياً، والتقنيات التي استخدمتها، ونطاق عملك..."
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-600">
                  ركز على ما كنت مسؤولاً عنه وكيف ساهمت في الفريق/الشركة
                </p>
                <span className={`text-xs ${
                  work.responsibilities.trim().length >= 10 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {work.responsibilities.trim().length}/10 min
                </span>
              </div>
              {work.responsibilities.trim().length > 0 && work.responsibilities.trim().length < 10 && (
                <p className="text-red-500 text-sm mt-1">
                  يرجى كتابة 10 أحرف على الأقل لوصف مسؤولياتك
                </p>
              )}
            </div>

            {/* Achievements */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-carbon mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                الإنجازات الرئيسية والتأثير
                <span className="text-gray-400 text-xs ml-2">(اختياري)</span>
              </label>
              <textarea
                value={work.achievements}
                onChange={(e) => updateWorkExperience(index, 'achievements', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all resize-none"
                rows="3"
                placeholder="اذكر إنجازاتك، النتائج القابلة للقياس، الجوائز، أو التقدير. اشمل المقاييس عند الإمكان (مثل: 'زيادة المبيعات بنسبة 25%'، 'قيادة فريق من 8 مطورين'، 'تقليل وقت المعالجة بنسبة 40%')..."
              />
              <p className="text-xs text-gray-600 mt-1">
                قس تأثيرك بالأرقام، النسب المئوية، أو النتائج المحددة عند الإمكان
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {work.title && work.company ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm text-gray-600">المعلومات الأساسية</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {work.responsibilities && work.responsibilities.trim().length >= 10 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm text-gray-600">المسؤوليات</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {work.achievements && work.achievements.trim().length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className="text-sm text-gray-600">الإنجازات</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {workExperiences.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد خبرة عملية مضافة بعد. انقر على &quot;إضافة خبرة&quot; للبدء.</p>
          </div>
        )}

        {/* Overall completion status */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isFormValid() ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
              <span className="font-medium text-carbon">
                قسم الخبرة العملية
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {isFormValid() ? 'مكتمل' : 'غير مكتمل'}
            </span>
          </div>
          {!isFormValid() && (
            <p className="text-sm text-gray-600 mt-2">
              يرجى التأكد من أن جميع الخبرات العملية تحتوي على المسمى الوظيفي، الشركة، والمسؤوليات المفصلة.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkExperienceComponent;
