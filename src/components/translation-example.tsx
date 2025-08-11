import { useTranslation } from 'react-i18next';

/**
 * Example component demonstrating how to use react-i18next for translations
 */
export function TranslationExample() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">
        {t('pages.translationExample.title', 'Translation Example')}
      </h2>
      
      <div className="space-y-2">
        <p>{t('common.email')}: example@hoergen.com</p>
        <p>{t('common.password')}: ********</p>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => alert(t('auth.loginSuccess'))}
          >
            {t('common.login')}
          </button>
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded"
            onClick={() => alert(t('common.cancel'))}
          >
            {t('common.cancel')}
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {t('pages.translationExample.currentLanguage', 'Current language')}: {i18n.language}
          </p>
          <button
            className="text-sm px-3 py-1 border rounded"
            onClick={() => changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
          >
            {t('pages.translationExample.switchLanguage', 'Switch Language')}
          </button>
        </div>
      </div>
    </div>
  );
}