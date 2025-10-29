import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import type { Metadata } from 'next';

import './globals.css';
import { DEFAULT_TITLE } from './constants';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages({ locale });
  const title = (messages.TabTitle?.home as string) ?? DEFAULT_TITLE;

  return {
    title,
  };
}

interface RootLayoutProp {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProp) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50">
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
