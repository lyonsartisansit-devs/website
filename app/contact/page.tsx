'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { PageHeader } from '@/components/page-header';
import { contact } from '@/lib/i18n';
import { BrandPattern } from '@/components/brand-pattern';

export default function ContactPage() {
  const { lang } = useLanguage();
  const t = contact[lang];
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <article className="relative overflow-hidden">
      <BrandPattern className="absolute -right-1/4 top-0 h-full w-[120%] pointer-events-none md:-right-1/3 " />

      <div className="relative z-10">
        <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            {/* Details */}
            <aside className="flex flex-col gap-10 md:col-span-4">
              <div className="flex flex-col gap-2">
                <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {t.locationLabel}
                </p>
                <p className="font-serif text-xl">{t.location}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {t.emailLabel}
                </p>
                <a
                  href={`mailto:${t.email}`}
                  className="font-serif text-xl transition-colors hover:text-primary"
                >
                  {t.email}
                </a>
              </div>
              <p className="font-subheading border-t border-border pt-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Human Hands · Refined Machinery · Premium Materials
              </p>
            </aside>

            {/* Form */}
            <div className="md:col-span-8">
              {submitted ? (
                <div className="flex flex-col items-start gap-4 rounded-sm border border-border bg-card p-10">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-5" />
                  </span>
                  <p className="text-pretty font-serif text-2xl font-light leading-snug">
                    {t.form.success}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label={t.form.name} name="name" required />
                    <Field label={t.form.company} name="company" required />
                    <Field
                      label={t.form.email}
                      name="email"
                      type="email"
                      required
                    />
                    <Field label={t.form.phone} name="phone" type="tel" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="message"
                      className="font-subheading text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      {t.form.message}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="resize-none rounded-sm border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-fit items-center gap-2 rounded-sm bg-foreground px-8 py-3.5 text-sm tracking-wide text-background transition-colors hover:bg-primary"
                  >
                    {t.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="font-subheading text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="rounded-sm border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
