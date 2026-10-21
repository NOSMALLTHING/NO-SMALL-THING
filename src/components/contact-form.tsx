"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { contactDetails, enquiryMailto, enquiryText, serviceOptions, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/contact";
import { Arrow } from "./ui/arrow";
import styles from "./contact-section.module.css";

const emptyEnquiry: Enquiry = { name: "", email: "", service: "", message: "" };

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"editing" | "invalid" | "ready" | "downloaded">("editing");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  function update(field: keyof Enquiry, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    setStatus("editing");
    if (errors[field]) setErrors(previous => ({ ...previous, [field]: validateEnquiry(next)[field] }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors);
    const firstError = (Object.keys(emptyEnquiry) as (keyof Enquiry)[]).find(field => nextErrors[field]);
    if (firstError) {
      setStatus("invalid");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus());
      return;
    }
    setStatus("ready");
  }

  function saveDraft() {
    const url = URL.createObjectURL(new Blob([`NO SMALL THING — Project enquiry\nTo: ${contactDetails.email}\n\n${enquiryText(values)}`], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "no-small-thing-enquiry.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("downloaded");
  }

  const errorProps = (field: keyof Enquiry) => ({ "aria-invalid": errors[field] ? true : undefined, "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined });
  const blur = (field: keyof Enquiry) => setErrors(previous => ({ ...previous, [field]: validateEnquiry(values)[field] }));

  return <form id="enquiry-form" className={styles.form} noValidate onSubmit={submit} ref={formRef} aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`}>
    <h3 id={`${id}-title`} className={styles.formTitle}>Tell us what you have in mind.</h3>
    <p id={`${id}-note`} className={styles.formNote}>This form prepares an email draft. Nothing is sent from this website; review and send it in your email app.</p>
    <div className={styles.fields}>
      <div className={styles.field}><label htmlFor={`${id}-name`}>Name <span aria-hidden="true">*</span></label><input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={event => update("name", event.target.value)} onBlur={() => blur("name")} {...errorProps("name")} />{errors.name && <p id={`${id}-name-error`} className={styles.error}>{errors.name}</p>}</div>
      <div className={styles.field}><label htmlFor={`${id}-email`}>Email <span aria-hidden="true">*</span></label><input id={`${id}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} value={values.email} onChange={event => update("email", event.target.value)} onBlur={() => blur("email")} {...errorProps("email")} />{errors.email && <p id={`${id}-email-error`} className={styles.error}>{errors.email}</p>}</div>
      <div className={`${styles.field} ${styles.fullField}`}><label htmlFor={`${id}-service`}>Service <span aria-hidden="true">*</span></label><select id={`${id}-service`} name="service" required value={values.service} onChange={event => update("service", event.target.value)} onBlur={() => blur("service")} {...errorProps("service")}><option value="">Select a service</option>{serviceOptions.map(service => <option key={service} value={service}>{service}</option>)}</select>{errors.service && <p id={`${id}-service-error`} className={styles.error}>{errors.service}</p>}</div>
      <div className={`${styles.field} ${styles.fullField}`}><label htmlFor={`${id}-message`}>Message <span aria-hidden="true">*</span></label><textarea id={`${id}-message`} name="message" rows={4} required minLength={10} maxLength={5000} value={values.message} onChange={event => update("message", event.target.value)} onBlur={() => blur("message")} {...errorProps("message")} />{errors.message && <p id={`${id}-message-error`} className={styles.error}>{errors.message}</p>}</div>
    </div>
    <div className={styles.formBottom}><span className={styles.requiredNote}>All fields are required.</span><button type="submit" className={styles.submit} disabled={!hydrated}>Prepare enquiry <Arrow /></button></div>
    <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
      {status === "invalid" && <p>Please check the highlighted fields. Nothing has been sent.</p>}
      {(status === "ready" || status === "downloaded") && <>
        <p>{status === "downloaded" ? "Your draft was downloaded. It has not been sent." : "Your email draft is ready. Open it in your email app to review and send. Nothing has been sent yet."}</p>
        <div className={styles.draftActions}><a href={enquiryMailto(values)}>Open email draft <Arrow /></a><button type="button" onClick={saveDraft}>Download a copy</button></div>
        <p className={styles.draftHelp}>No email app? Download the copy and email it to {contactDetails.email}.</p>
      </>}
    </div>
    <noscript><p>Please email <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a> to discuss your project. JavaScript is needed to prepare a draft here.</p></noscript>
  </form>;
}
