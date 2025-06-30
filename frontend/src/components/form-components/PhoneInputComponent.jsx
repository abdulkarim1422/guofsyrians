import { Phone } from 'lucide-react';

export function PhoneInputComponent(formData, setFormData) {
  // Phone validation function
  const isValidPhone = (phone) => {
    const phoneRegex = /^\+\d{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Phone number formatting and validation handler
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    const countryCode = formData.countryCode || '+90';
    
    // Remove all non-digit characters except the + at the beginning
    value = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with the selected country code
    if (!value.startsWith(countryCode)) {
      value = countryCode + value.replace(/^\+?\d*/, '');
    }
    
    // Format the number based on country code for better readability
    let formattedValue = value;
    if (countryCode === '+90' && value.length > 3) {
      // Turkish formatting: +90 5xx xxx xx xx
      const digits = value.slice(3);
      if (digits.length > 0) {
        formattedValue = countryCode + ' ';
        if (digits.length <= 3) {
          formattedValue += digits;
        } else if (digits.length <= 6) {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3);
        } else if (digits.length <= 8) {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6);
        } else {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 8) + ' ' + digits.slice(8, 10);
        }
      }
    } else if (countryCode === '+963' && value.length > 4) {
      // Syrian formatting: +963 xxx xxx xxx
      const digits = value.slice(4);
      if (digits.length > 0) {
        formattedValue = countryCode + ' ';
        if (digits.length <= 3) {
          formattedValue += digits;
        } else if (digits.length <= 6) {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3);
        } else {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 9);
        }
      }
    } else if (countryCode === '+1' && value.length > 2) {
      // US/Canada formatting: +1 xxx xxx xxxx
      const digits = value.slice(2);
      if (digits.length > 0) {
        formattedValue = countryCode + ' ';
        if (digits.length <= 3) {
          formattedValue += digits;
        } else if (digits.length <= 6) {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3);
        } else {
          formattedValue += digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 10);
        }
      }
    } else {
      // Generic formatting for other countries: add space after country code
      const countryCodeLength = countryCode.length;
      if (value.length > countryCodeLength) {
        formattedValue = countryCode + ' ' + value.slice(countryCodeLength);
      }
    }
    
    // Limit total length (country code + 15 digits max)
    const digitsOnly = formattedValue.replace(/[^\d]/g, '');
    if (digitsOnly.length <= 17) { // Allow a bit more for different country code lengths
      setFormData(prev => ({
        ...prev,
        phone: formattedValue
      }));
    }
  };

  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
        رقم الهاتف *
      </label>
      <div className="relative">
        <div className="flex">
          {/* Country Code Selector */}
          <select
            value={formData.countryCode || '+90'}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                countryCode: e.target.value,
                phone: e.target.value + ' '
              }));
            }}
            className="px-3 py-3 bg-white border-2 border-gray-200 border-r-0 text-carbon rounded-l-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all min-w-[100px]"
            dir="ltr"
          >
            <option value="+90">🇹🇷 +90</option>
            <option value="+963">🇸🇾 +963</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+39">🇮🇹 +39</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+31">🇳🇱 +31</option>
            <option value="+46">🇸🇪 +46</option>
            <option value="+47">🇳🇴 +47</option>
            <option value="+45">🇩🇰 +45</option>
            <option value="+358">🇫🇮 +358</option>
            <option value="+43">🇦🇹 +43</option>
            <option value="+41">🇨🇭 +41</option>
            <option value="+32">🇧🇪 +32</option>
            <option value="+352">🇱🇺 +352</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+966">🇸🇦 +966</option>
            <option value="+965">🇰🇼 +965</option>
            <option value="+974">🇶🇦 +974</option>
            <option value="+973">🇧🇭 +973</option>
            <option value="+968">🇴🇲 +968</option>
            <option value="+962">🇯🇴 +962</option>
            <option value="+961">🇱🇧 +961</option>
            <option value="+20">🇪🇬 +20</option>
            <option value="+212">🇲🇦 +212</option>
            <option value="+213">🇩🇿 +213</option>
            <option value="+216">🇹🇳 +216</option>
            <option value="+964">🇮🇶 +964</option>
          </select>
          
          {/* Phone Number Input */}
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              pattern="\+\d{7,15}"
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 text-carbon rounded-r-lg focus:ring-2 focus:ring-rich-gold focus:border-rich-gold transition-all"
              placeholder="+90 5xx xxx xx xx"
              dir="ltr"
            />
          </div>
        </div>
        
        {/* Phone validation feedback */}
        {formData.phone && !isValidPhone(formData.phone) && (
          <p className="text-red-600 text-xs mt-1" dir="rtl">
            يرجى إدخال رقم هاتف صالح (7-15 رقم بعد رمز البلد)
          </p>
        )}
        {formData.phone && isValidPhone(formData.phone) && (
          <p className="text-green-600 text-xs mt-1" dir="rtl">
            ✓ رقم الهاتف صحيح
          </p>
        )}
      </div>
    </div>
  );
}
