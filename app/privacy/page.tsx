import type { Metadata } from 'next';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy - InnstaStay',
    description: 'Learn how InnstaStay protects your privacy and handles your personal information.',
    robots: 'index, follow'
  }
}

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600">
        This privacy policy page will be updated with your privacy policy content.
      </p>
    </div>
  )
}
