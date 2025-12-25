// profilesettings
import { useState, useEffect } from 'react';
import { profileStore, type ProfileData } from '@extension/storage/lib/stores/profileStore';
import { useStorage } from '@extension/shared';
import { Button } from '@extension/ui';
import { t } from '@extension/i18n';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface ProfileSettingsProps {
  isDarkMode: boolean;
}

interface CustomField {
  key: string;
  label: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isDarkMode }) => {
  const profileData = useStorage(profileStore);
  const [formData, setFormData] = useState<ProfileData>({});
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [saved, setSaved] = useState(false);

  // Predefined fields
  const predefinedFields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'address', label: 'Address' },
    { key: 'college', label: 'College/University' },
    { key: 'job', label: 'Job Title' },
    { key: 'age', label: 'Age' },
  ];

  useEffect(() => {
    setFormData(profileData);

    // Extract custom fields from profile data
    const customKeys = Object.keys(profileData).filter(key => !predefinedFields.find(field => field.key === key));
    setCustomFields(customKeys.map(key => ({ key, label: key })));
  }, [profileData]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await profileStore.setProfileData(formData);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleClear = async () => {
    await profileStore.clearProfileData();
    setFormData({});
    setCustomFields([]);
  };

  // Convert label to key (e.g., "Passport Number" -> "passport_number")
  const labelToKey = (label: string): string => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  };

  const addCustomField = () => {
    if (newFieldLabel.trim()) {
      const fieldKey = labelToKey(newFieldLabel);

      // Check if field already exists
      if (predefinedFields.find(f => f.key === fieldKey) || customFields.find(f => f.key === fieldKey)) {
        alert('A field with this name already exists!');
        return;
      }

      setCustomFields(prev => [...prev, { key: fieldKey, label: newFieldLabel.trim() }]);
      setFormData(prev => ({ ...prev, [fieldKey]: '' }));
      setNewFieldLabel('');
    }
  };

  const removeCustomField = (key: string) => {
    setCustomFields(prev => prev.filter(field => field.key !== key));
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  return (
    <section className="space-y-6">
      {/* Basic Information Section */}
      <div className="rounded-lg bg-black/30 backdrop-blur-sm pointer-events-none p-6 text-left shadow-sm">
        <h2 className={`mb-2 text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Profile Settings
        </h2>
        <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Store your personal information to automatically fill forms across websites.
        </p>

        <div>
          <h3 className={`mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Basic Information
          </h3>
          <div className="space-y-3">
            {predefinedFields.map(field => (
              <div key={field.key} className="flex items-center">
                <label
                  htmlFor={field.key}
                  className={`w-40 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  className="flex-1 rounded-md border text-sm text-[#006400] bg-white/80 pointer-events-auto px-3 py-2 outline-none"
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Fields Section */}
      <div className="rounded-lg bg-black/30 backdrop-blur-sm pointer-events-none p-6 text-left shadow-sm">
        <h3 className={`mb-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custom Fields</h3>

        {/* Add new custom field */}
        <div className="flex items-center gap-2 mb-4">
          <label className={`w-40 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Add Field
          </label>
          <input
            type="text"
            value={newFieldLabel}
            onChange={e => setNewFieldLabel(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addCustomField()}
            className="flex-1 rounded-md border text-sm bg-white/80 pointer-events-auto px-3 py-2 outline-none"
            placeholder="Enter field name (e.g., Passport Number, LinkedIn Profile)"
          />
          <Button
            onClick={addCustomField}
            className="rounded-full border text-green-600 border-white bg-white/50 hover:bg-white/60 shadow-md pointer-events-auto px-4 py-2 flex items-center gap-2">
            <FiPlus />
            <span className="text-sm">Add</span>
          </Button>
        </div>

        {/* Custom fields list */}
        {customFields.length > 0 ? (
          <div className="space-y-3">
            {customFields.map(field => (
              <div key={field.key} className="flex items-center gap-2">
                <div className={`w-40 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.label}
                </div>
                <input
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  className="flex-1 rounded-md border text-sm text-[#006400] bg-white/80 pointer-events-auto px-3 py-2 outline-none"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                <Button
                  onClick={() => removeCustomField(field.key)}
                  className="rounded-full border text-red-600 border-white bg-white/50 hover:bg-white/60 shadow-md pointer-events-auto px-3 py-2 flex items-center justify-center">
                  <FiTrash2 />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No custom fields added yet. Add fields specific to your needs above.
          </p>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="rounded-lg bg-black/30 backdrop-blur-sm pointer-events-none p-6 text-left shadow-sm">
        <div className="flex space-x-4">
          <Button
            onClick={handleSave}
            className={`rounded-full border pointer-events-auto px-6 py-3 font-medium shadow-md transition-all duration-300 ${
              saved
                ? 'text-[#006400] border-white bg-white/50 hover:bg-white/60'
                : 'text-[#006400] border-white bg-white/50 hover:bg-white/60'
            }`}>
            <span className="text-sm">{saved ? 'Data Saved ✓' : 'Save Data'}</span>
          </Button>
          <Button
            onClick={handleClear}
            className="rounded-full border text-red-600 border-white bg-white/50 hover:bg-white/60 shadow-md pointer-events-auto px-6 py-3 font-medium">
            <span className="text-sm">Clear All Data</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
