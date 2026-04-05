import { useTranslation } from "react-i18next";

export default function AnswerInput({ value, onChange, onSubmit, disabled }) {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        placeholder="Typ je antwoord..."
        className="w-full px-4 py-3 rounded-xl
          bg-white border border-gray-200
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          focus:outline-none focus:border-blue-400 disabled:opacity-50"
        autoFocus
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="w-full px-6 py-3 rounded-xl font-medium
          bg-blue-500 text-white hover:bg-blue-600
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Controleer antwoord
      </button>
    </div>
  );
}