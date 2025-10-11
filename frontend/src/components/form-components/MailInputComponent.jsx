
import { Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

export function MailInputComponent({ formData, setFormData, setFormValid }) {
    // Email validation regex (simple version)
    const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
    const [touched, setTouched] = useState(false);
    const email = formData?.email || '';
    const isValid = emailRegex.test(email);

    useEffect(() => {
        if (setFormValid) setFormValid(isValid);
    }, [isValid, setFormValid]);

    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
                البريد الإلكتروني *
            </label>
            <div className="relative flex">
                <div className="relative flex-grow">
                    <Mail className="absolute right-2 sm:right-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => {
                            setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }));
                        }}
                        onBlur={() => setTouched(true)}
                        required
                        className={`w-full pl-6 sm:pl-10 pr-4 py-1.5 sm:py-3 bg-white border-2 ${!isValid && touched ? 'border-red-500' : 'border-gray-200'} text-carbon rounded-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all arabic-text text-xs sm:text-base`}
                        placeholder="بريدك الإلكتروني"
                        autoComplete="off"
                        dir="ltr"
                    />
                    {!isValid && touched && (
                        <span className="absolute left-2 top-2 text-xs text-red-500">البريد الإلكتروني غير صالح</span>
                    )}
                </div>
            </div>
        </div>
    );
}
