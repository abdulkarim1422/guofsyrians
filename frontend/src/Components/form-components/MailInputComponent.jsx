import { Mail } from 'lucide-react';

export function MailInputComponent(formData, setFormData) {
    return <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 arabic-text-medium" dir="rtl">
            البريد الإلكتروني (Gmail فقط) *
        </label>
        <div className="relative flex">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
                type="text"
                id="email"
                name="email"
                value={formData.email.replace(/@gmail\.com$/, '')}
                onChange={e => {
                    // Prevent '@' character and force gmail.com
                    let value = e.target.value.replace(/@/g, '');
                    setFormData(prev => ({
                        ...prev,
                        email: value + '@gmail.com'
                    }));
                } }
                onKeyDown={e => {
                    if (e.key === '@') {
                        e.preventDefault();
                    }
                } }
                required
                className="w-full pl-10 pr-28 py-3 bg-gray-700 border border-gray-600 text-white rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all arabic-text"
                placeholder="بريدك الإلكتروني"
                autoComplete="off" 
                dir="ltr" />
            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-600 bg-gray-700 text-gray-300 text-sm select-none">
                @gmail.com
            </span>
        </div>
    </div>;
}
