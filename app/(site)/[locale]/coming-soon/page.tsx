import { setRequestLocale } from 'next-intl/server'
import { UnderConstruction } from '@/components/under-construction'

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <UnderConstruction />
}
