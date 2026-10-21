import { pageMetadata } from "@/lib/seo";
import { ContactSection } from "@/components/contact-section";

export const metadata = pageMetadata("Contact", "Have an idea, a challenge, or something worth building? Let's talk. Contact NO SMALL THING about your next digital project.", "/contact");

export default function ContactPage() {
  return <ContactSection standalone />;
}
