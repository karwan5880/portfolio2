import { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  const { getThemeClasses } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'celebration':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600';
      case 'completion':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'
    }`}>
      <div className={`
        ${getToastStyles()}
        px-6 py-4 rounded-lg shadow-lg border-2 
        flex items-center gap-3 min-w-[280px] max-w-[400px]
        backdrop-blur-sm
      `}>
        <div className="flex-1">
          <p className="font-medium text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;