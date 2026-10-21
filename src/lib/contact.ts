export const contactDetails = {
  email: "nosmallthing.limited@gmail.com",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/no-small-thing-987899445/" },
    { label: "Instagram", href: "https://www.instagram.com/nosmallthing.limited/?hl=en" },
    { label: "GitHub", href: "https://github.com/NOSMALLTHING" },
  ],
} as const;

export const serviceOptions = [
  "AI Services & Solutions",
  "Website Design & Development",
  "UI/UX Design",
  "Software Development",
  "IT Services & Digital Solutions",
] as const;

export type Enquiry = { name: string; email: string; service: string; message: string };
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(values: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length > 100 || /[\r\n]/.test(values.name)) errors.name = "Please use a name of 100 characters or fewer.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!(serviceOptions as readonly string[]).includes(values.service)) errors.service = "Please select a service.";
  if (values.message.trim().length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  else if (values.message.length > 5000) errors.message = "Please keep your message within 5,000 characters.";
  return errors;
}

export function enquiryText(values: Enquiry) {
  return `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\nService: ${values.service}\n\n${values.message.trim()}`;
}

/** Opens a draft only. The visitor must review and send it in their own email app. */
export function enquiryMailto(values: Enquiry) {
  return `mailto:${contactDetails.email}?subject=${encodeURIComponent(`Project enquiry — ${values.service}`)}&body=${encodeURIComponent(enquiryText(values))}`;
}
