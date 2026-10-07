import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from './env'

export type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]

// https://www.sanity.io/docs/image-url
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: SanityImageSource) => {
  return imageBuilder.image(source).auto('format').fit('max')
}

export const urlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source)
}
