import { Mail } from 'lucide-react';

export function MailInputComponent({ formData, setFormData }) {
    return <div>
        <label htmlFor="email" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
            البريد الإلكتروني (Gmail فقط) *
        </label>
        <div className="relative flex">
            <div className="relative flex-grow">
                <Mail className="absolute right-2 sm:right-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                    type="text"
                    id="email"
                    name="email"
                    value={(formData?.email || '').replace(/@gmail\.com$/, '')}
                    onChange={e => {
                        // Prevent '@' character, spaces, and force gmail.com
                        let value = e.target.value.replace(/@/g, '').replace(/\s/g, '');
                        setFormData(prev => ({
                            ...prev,
                            email: value + '@gmail.com'
                        }));
                    } }
                    onKeyDown={e => {
                        if (e.key === '@' || e.key === ' ') {
                            e.preventDefault();
                        }
                    } }
                    required
                    className="w-full pl-6 sm:pl-10 pr-16 sm:pr-28 py-1.5 sm:py-3 bg-white border-2 border-gray-200 text-carbon rounded-l-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text text-xs sm:text-base"
                    placeholder="بريدك الإلكتروني"
                    autoComplete="off" 
                    dir="ltr" />
            </div>
            <span className="inline-flex items-center px-1.5 sm:px-3 rounded-r-lg border-2 border-l-0 border-gray-200 bg-gray-100 text-carbon text-xs sm:text-sm select-none">
                @gmail.com
            </span>
        </div>
    </div>;
}
