const HelpSection = () => {
  const helpItems = [
    {
      title: "User Management",
      description: "Learn how to manage users, roles, and permissions.",
      items: [
        "Create and edit user accounts",
        "Assign roles (admin, member)",
        "Verify user accounts",
        "Activate/deactivate users"
      ]
    },
    {
      title: "Profile Settings",
      description: "Customize your personal profile information.",
      items: [
        "Update your name and personal details",
        "Change your password",
        "View account status and role"
      ]
    },
    {
      title: "Security",
      description: "Keep your account secure with these best practices.",
      items: [
        "Use strong, unique passwords",
        "Regularly update your password",
        "Report suspicious activity",
        "Keep your profile information up to date"
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Help & Documentation
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Quick guide to using the system effectively.
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {helpItems.map((section, index) => (
            <div key={index}>
              <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                {section.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {section.description}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Need more help?
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>If you need additional assistance, please contact the system administrator or check the full documentation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
