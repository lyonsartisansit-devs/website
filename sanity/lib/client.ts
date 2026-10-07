import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from './env'

const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_WRITE_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token,
})

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags = [],
  revalidate,
}: {
  query: QueryString
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}) {
  return client.fetch(query, params, {
    next: {
      tags,
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  })
}
