import { createFileRoute } from '@tanstack/react-router'
import { TranslationExample } from '@/components/translation-example'

export const Route = createFileRoute('/i18n-demo')({
  component: TranslationDemo,
})

function TranslationDemo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">i18n Translation Demo</h1>
      <TranslationExample />
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>All visible text is now managed through translation keys in <code>src/locales/en.json</code></li>
          <li>Components use the <code>useTranslation()</code> hook to access the <code>t()</code> function</li>
          <li>Translation keys are organized by feature: auth, navigation, common, forms, etc.</li>
          <li>Form validation messages are also translated</li>
          <li>Error messages in authentication flows are localized</li>
          <li>The system supports language detection and switching</li>
        </ul>
      </div>
    </div>
  )
}