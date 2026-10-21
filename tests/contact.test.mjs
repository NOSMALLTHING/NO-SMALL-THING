import test from "node:test";
import assert from "node:assert/strict";
import { contactDetails, enquiryMailto, enquiryText, serviceOptions, validateEnquiry } from "../src/lib/contact.ts";

const valid = { name: "A Test Visitor", email: "visitor@example.com", service: serviceOptions[0], message: "We would like to discuss a website project." };

test("all four required fields have actionable errors", () => {
  const errors = validateEnquiry({ name: " ", email: "", service: "", message: " " });
  assert.deepEqual(Object.keys(errors), ["name", "email", "service", "message"]);
});
test("accepts Unicode names, trimmed email and all supported services", () => {
  for (const service of serviceOptions) assert.deepEqual(validateEnquiry({ ...valid, name: "李 — O’Connor", email: " visitor@example.com ", service }), {});
});
test("rejects invalid emails, unknown services and out-of-range message lengths", () => {
  assert.ok(validateEnquiry({ ...valid, email: "a@" }).email);
  assert.ok(validateEnquiry({ ...valid, service: "Unsupported service" }).service);
  assert.ok(validateEnquiry({ ...valid, message: "short" }).message);
  assert.ok(validateEnquiry({ ...valid, message: "x".repeat(5001) }).message);
  assert.ok(validateEnquiry({ ...valid, name: "Name\nInjected" }).name);
});
test("email draft keeps user text in encoded body and uses the provided recipient", () => {
  const values = { ...valid, message: "Research & design? Yes.\n你好 + #project" };
  const url = new URL(enquiryMailto(values));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, contactDetails.email);
  assert.equal(url.searchParams.get("body"), enquiryText(values));
  assert.equal(url.searchParams.get("subject"), `Project enquiry — ${valid.service}`);
  assert.equal(url.searchParams.has("bcc"), false);
});
