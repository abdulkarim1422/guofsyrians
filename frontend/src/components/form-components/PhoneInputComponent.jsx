import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export function PhoneInputComponent({ formData, setFormData }) {
  // Phone validation function - simplified since react-international-phone handles formatting
  const isValidPhone = (phone) => {
    // Remove spaces and check if it's a valid international format
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.length >= 8 && cleanPhone.startsWith('+');
  };

  // Handle phone change
  const handlePhoneChange = (phone) => {
    setFormData(prev => ({
      ...prev,
      phone: phone
    }));
  };

  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-carbon mb-2 arabic-text-medium" dir="rtl">
        رقم الهاتف *
      </label>
      <div className="relative">
        <div className="phone-input-container">
          <PhoneInput
            defaultCountry="tr"
            value={formData.phone || ''}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              placeholder: 'Enter phone number'
            }}
          />
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .phone-input-container .react-international-phone-input-container {
              display: flex !important;
              width: 100% !important;
            }
            
            .phone-input-container .react-international-phone-country-selector-button {
              padding: 6px 8px !important;
              background-color: white !important;
              border: 2px solid #d1d5db !important;
              border-right: none !important;
              border-radius: 0.5rem 0 0 0.5rem !important;
              color: #1f2937 !important;
              font-size: 12px !important;
              transition: all 0.2s !important;
              min-width: 60px !important;
              height: 36px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            @media (min-width: 640px) {
              .phone-input-container .react-international-phone-country-selector-button {
                padding: 12px !important;
                min-width: 80px !important;
                height: 48px !important;
              }
            }
            
            .phone-input-container .react-international-phone-country-selector-button:focus {
              outline: none !important;
              border-color: #d4af37 !important;
              box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
            }
            
            .phone-input-container .react-international-phone-input {
              flex: 1 !important;
              padding: 6px 8px !important;
              background-color: white !important;
              border: 2px solid #d1d5db !important;
              border-left: none !important;
              border-radius: 0 0.5rem 0.5rem 0 !important;
              color: #1f2937 !important;
              font-size: 12px !important;
              transition: all 0.2s !important;
              height: 36px !important;
              outline: none !important;
            }
            
            @media (min-width: 640px) {
              .phone-input-container .react-international-phone-input {
                padding: 12px 16px !important;
                height: 48px !important;
              }
            }
            
            .phone-input-container .react-international-phone-input:focus {
              border-color: #d4af37 !important;
              box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
            }
            
            .phone-input-container .react-international-phone-country-selector-dropdown {
              border: 2px solid #d1d5db !important;
              border-radius: 0.5rem !important;
              background-color: white !important;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
              z-index: 50 !important;
            }
          `
        }} />
        
        {/* Phone validation feedback */}
        {formData.phone && !isValidPhone(formData.phone) && (
          <p className="text-red-600 text-xs mt-1" dir="rtl">
            يرجى إدخال رقم هاتف صالح
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
