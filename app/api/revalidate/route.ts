import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type?: string
  _id?: string
  slug?: {
    current?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_WEBHOOK_SECRET,
      true // small delay to allow CDN to synchronize
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad request: Missing _type in payload', { status: 400 })
    }

    // Revalidate primary tag for document type
    revalidateTag(body._type, 'max')

    // If a post was modified, also revalidate its specific slug tag and journalPage
    if (body._type === 'post') {
      if (body.slug?.current) {
        revalidateTag(`post:${body.slug.current}`, 'max')
      }
      revalidateTag('journalPage', 'max')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      type: body._type,
      id: body._id,
      now: Date.now(),
    })
  } catch (err: any) {
    console.error('Revalidation webhook error:', err)
    return new NextResponse(err.message || 'Internal Server Error', { status: 500 })
  }
}
