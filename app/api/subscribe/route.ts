import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getSubscriberEmailHtml(lang: 'en' | 'es') {
  const isEs = lang === 'es'

  const title = isEs ? 'Estás en la lista.' : 'You are on the list.'
  const subtitle = isEs
    ? 'LEÓN, GUANAJUATO · MANUFACTURA EST.'
    : 'LEÓN, GUANAJUATO · EST. MANUFACTURE'
  const body1 = isEs
    ? 'Gracias por tu interés en Lyon’s Artisans. Hemos registrado tu correo para compartir contigo la revelación de la primera colección, notas privadas de estudio y novedades antes del lanzamiento oficial.'
    : 'Thank you for your interest in Lyon’s Artisans. Your email has been reserved to receive the first collection reveal, private studio notes, and official launch updates.'
  const body2 = isEs
    ? 'Nuestra casa en León, México une siglos de tradición zapatera artesanal con una visión contemporánea y rigurosa.'
    : 'Our house in León, Mexico bridges centuries of bespoke shoemaking heritage with an uncompromising contemporary vision.'
  const footerContact = isEs
    ? 'Si deseas iniciar una conversación directa o conocer más sobre nuestra manufactura, escríbenos a'
    : 'For bespoke inquiries or private appointments, reach us directly at'

  return `
    <!DOCTYPE html>
    <html lang="${lang}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0D0B09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F3EFE7;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #14100E; border: 1px solid #29221C; border-radius: 8px; overflow: hidden; margin-top: 32px; margin-bottom: 32px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 36px 24px; text-align: center; border-bottom: 1px solid #29221C;">
              <div style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #C9B6A3; font-weight: 600; margin-bottom: 8px;">
                ${subtitle}
              </div>
              <h1 style="font-size: 24px; font-weight: 400; letter-spacing: 0.15em; color: #F3EFE7; margin: 0; text-transform: uppercase; font-family: Georgia, serif;">
                LYON’S ARTISANS
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 36px;">
              <h2 style="font-size: 28px; font-weight: normal; color: #F3EFE7; font-family: Georgia, serif; margin: 0 0 20px 0; line-height: 1.2;">
                ${title}
              </h2>
              <p style="font-size: 15px; line-height: 1.7; color: #C9BFB5; margin: 0 0 20px 0; font-weight: 300;">
                ${body1}
              </p>
              <p style="font-size: 15px; line-height: 1.7; color: #A69988; margin: 0 0 32px 0; font-weight: 300;">
                ${body2}
              </p>
              
              <div style="border-top: 1px solid #29221C; padding-top: 24px;">
                <p style="font-size: 13px; line-height: 1.6; color: #8F8171; margin: 0;">
                  ${footerContact} <a href="mailto:hello@lyonsartisans.mx" style="color: #C9B6A3; text-decoration: none; font-weight: 500;">hello@lyonsartisans.mx</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #0A0807; text-align: center; border-top: 1px solid #29221C;">
              <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #736555; margin: 0;">
                LEÓN, GUANAJUATO · MÉXICO · 2026
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

function getAdminAlertHtml(email: string, lang: string, dateStr: string) {
  const safeEmail = escapeHtml(email)
  const safeLang = escapeHtml(lang.toUpperCase())
  const safeDate = escapeHtml(dateStr)

  return `
    <div style="font-family: sans-serif; color: #191512; padding: 20px;">
      <h2 style="color: #191512; margin-top: 0;">Nuevo registro en Coming Soon</h2>
      <p>Un usuario ha solicitado el primer vistazo en la lista de espera:</p>
      <ul>
        <li><strong>Email:</strong> ${safeEmail}</li>
        <li><strong>Idioma:</strong> ${safeLang}</li>
        <li><strong>Fecha:</strong> ${safeDate}</li>
      </ul>
      <p style="font-size: 12px; color: #777;">Lyon's Artisans Notification System</p>
    </div>
  `
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, lang = 'en' } = body || {}

    if (
      !email ||
      typeof email !== 'string' ||
      email.length > 254 ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const selectedLang = lang === 'es' ? 'es' : 'en'

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || !resend) {
      console.warn(
        'RESEND_API_KEY is not configured. Email submission received for:',
        cleanEmail
      )
      return NextResponse.json({
        success: true,
        message: 'Subscription saved (Resend API key not configured yet)',
        devNotice: 'Set RESEND_API_KEY in your local.env / .env.local file to enable live delivery.',
      })
    }

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Lyon's Artisans <onboarding@resend.dev>"
    const notificationEmail = process.env.NOTIFICATION_EMAIL

    // 1. Send confirmation email to subscriber
    const subject =
      selectedLang === 'es'
        ? "Lyon's Artisans — Primer Vistazo Confirmado"
        : "Lyon's Artisans — The First Look"

    const { data: subscriberData, error: subscriberError } =
      await resend.emails.send({
        from: fromEmail,
        to: cleanEmail,
        subject,
        html: getSubscriberEmailHtml(selectedLang),
      })

    if (subscriberError) {
      console.error('Error sending confirmation email via Resend:', subscriberError)
      return NextResponse.json(
        { error: 'Unable to process subscription at this time' },
        { status: 500 }
      )
    }

    // 2. Optionally notify admin/brand team if NOTIFICATION_EMAIL is configured
    if (notificationEmail) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: notificationEmail,
          subject: `[Nuevo Lead Coming Soon] ${cleanEmail}`,
          html: getAdminAlertHtml(
            cleanEmail,
            selectedLang,
            new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
          ),
        })
      } catch (adminErr) {
        console.warn('Failed to send admin notification email:', adminErr)
      }
    }

    return NextResponse.json({
      success: true,
      id: subscriberData?.id,
    })
  } catch (err: any) {
    console.error('Unexpected error handling subscribe request:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
