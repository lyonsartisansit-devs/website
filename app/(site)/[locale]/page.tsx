import { setRequestLocale } from 'next-intl/server'
import FullHomePage from './full-home/page'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <FullHomePage />
}
