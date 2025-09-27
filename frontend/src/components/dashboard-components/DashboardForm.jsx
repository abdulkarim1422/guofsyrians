// C:\Users\abodi\OneDrive\Desktop\guofsyrians-main\frontend\src\components\dashboard-components\DashboardForm.jsx

import React, { useState } from 'react';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext.tsx";

function DashboardForm({ onSidebarHide }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    occupation: '',
    location: '',
    telephone: '',
    aboutDescription: '',
    storedSkills: '',
    storedInterests: '',
    linkedinUrl: '',
    githubUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      console.log('Form submitted:', formData);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-full h-screen hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">.</div>

      <div className="h-screen flex-grow overflow-x-hidden overflow-auto flex flex-col p-2">
        {/* Header */}
        <div className="w-full sm:flex p-2 items-end">
          <div className="sm:flex-grow flex justify-between items-start gap-3">
            {/* Left: title/info */}
            <div>
              <div className="flex items-center">
                <div className="text-3xl font-bold text-white">Resume Builder Form</div>
                <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
                  <Icon path="res-react-dash-premium-star" />
                  <div className="ml-2 font-bold text-premium-yellow">CREATE</div>
                </div>
              </div>
              <div className="flex items-center">
                <Icon path="res-react-dash-date-indicator" className="w-3 h-3" />
                <div className="ml-2">بناء سيرتك الذاتية المهنية</div>
              </div>
            </div>

            {/* Right: admin action + sidebar toggle */}
            <div className="flex items-center gap-2">
              {/* يظهر فقط للأدمن */}


              <IconButton
                icon="res-react-dash-sidebar-open"
                className="block sm:hidden"
                onClick={onSidebarHide}
              />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="w-full p-2">
          <div className="rounded-lg bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">المعلومات الشخصية</h3>
              <p className="text-gray-400 text-sm">Fill in your details to generate your resume</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
                <FormField
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Software Developer, Designer, etc."
                />
                <FormField
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
                <FormField
                  label="Phone Number"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">نبذة عني</h4>
                <FormField
                  label="Professional Summary"
                  name="aboutDescription"
                  value={formData.aboutDescription}
                  onChange={handleInputChange}
                  placeholder="Write a brief description about yourself, your experience, and career goals..."
                  multiline
                  rows={4}
                />
              </div>

              {/* Skills Section */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Skills</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Technical Skills"
                    name="storedSkills"
                    value={formData.storedSkills}
                    onChange={handleInputChange}
                    placeholder="React, JavaScript, Python, etc. (comma separated)"
                    multiline
                    rows={3}
                  />
                  <FormField
                    label="Soft Skills"
                    name="storedInterests"
                    value={formData.storedInterests}
                    onChange={handleInputChange}
                    placeholder="Leadership, Communication, Problem Solving, etc."
                    multiline
                    rows={3}
                  />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Social Media & Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="LinkedIn URL"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  <FormField
                    label="GitHub URL"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={clsx(
                      "flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all",
                      isSubmitting
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Resume...
                      </>
                    ) : (
                      <>
                        <Icon path="res-react-dash-add-component" className="w-5 h-5 mr-2" />
                        إنشاء السيرة الذاتية
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({
                      name: '', email: '', occupation: '', location: '', telephone: '',
                      aboutDescription: '', storedSkills: '', storedInterests: '',
                      linkedinUrl: '', githubUrl: ''
                    })}
                    className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all"
                  >
                    مسح النموذج
                  </button>

                  <button
                    type="button"
                    className="px-6 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    حفظ مسودة
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center">
                      <Icon path="res-react-dash-tick" className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-300 font-medium">Resume generated successfully!</span>
                    </div>
                    <p className="text-green-400 text-sm mt-1">You can now download your resume or share it online.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-red-300 font-medium">Error generating resume. Please try again.</span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="w-full p-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            icon="res-react-dash-premium-star"
            title="Professional Templates"
            description="Choose from multiple resume templates"
          />
          <FeatureCard
            icon="res-react-dash-add-component"
            title="Real-time Preview"
            description="See your resume as you build it"
          />
          <FeatureCard
            icon="res-react-dash-tick"
            title="Export Options"
            description="Download as PDF or share online"
          />
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  multiline = false,
  rows = 3
}) {
  const inputClasses = "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-500";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses + " resize-none"}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-lg bg-card p-6 hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-600">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-blue-900/30 rounded-lg">
          <Icon path={icon} className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Icon({ path = 'options', className = 'w-4 h-4' }) {
  return (
    <img
      src={`https://assets.codepen.io/3685267/${path}.svg`}
      alt=""
      className={clsx(className)}
    />
  );
}

function IconButton({
  onClick = () => {},
  icon = 'options',
  className = 'w-4 h-4',
}) {
  return (
    <button onClick={onClick} type="button" className={className}>
      <img
        src={`https://assets.codepen.io/3685267/${icon}.svg`}
        alt=""
        className="w-full h-full"
      />
    </button>
  );
}

export default DashboardForm;
