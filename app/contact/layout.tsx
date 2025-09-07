import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | InnstaStay',
  description:
    'Get in touch with InnstaStay. Questions about bookings, partnerships, or support? Email us at info@innstastay.com.',
  alternates: { canonical: 'https://www.innstastay.com/contact' },
  openGraph: {
    title: 'Contact InnstaStay',
    description:
      'Questions about bookings, partnerships, or support? Email us at info@innstastay.com.',
    url: 'https://www.innstastay.com/contact',
    siteName: 'InnstaStay',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact InnstaStay',
    description: 'Questions about bookings, partnerships, or support? Email us at info@innstastay.com.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
