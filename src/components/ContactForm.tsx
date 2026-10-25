import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Github, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import "./ContactForm.css";

/* Messages go through FormSubmit (formsubmit.co), which forwards them to Adrian's inbox.
   FORM_ID is the alias FormSubmit issued for that inbox, so the address stays out of
   the request URL. Each site address (localhost, akalvis.com) needs its own one-time
   activation: the first message sent from it triggers an email with an Activate link. */
const CONTACT_EMAIL = "adrians.kalvis2008@gmail.com";
const FORM_ID = "b3c62879dc611021e77ca1944db6f709";
const ENDPOINT = `https://formsubmit.co/ajax/${FORM_ID}`;

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = { email?: boolean; message?: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Checked only when Send is pressed, then live while the visitor fixes the field. */
const validate = (email: string, message: string): FieldErrors => ({
  email: !EMAIL_PATTERN.test(email.trim()) || undefined,
  message: message.trim().length < 2 || undefined,
});

/* Filled envelope, to match the solid icon on the Copy email pill. */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      fill="currentColor"
      d="M3.5 5h17A1.5 1.5 0 0 1 22 6.5v.4l-10 6.25L2 6.9v-.4A1.5 1.5 0 0 1 3.5 5Zm-1.5 4.26 9.47 5.92a1 1 0 0 0 1.06 0L22 9.26v8.24A1.5 1.5 0 0 1 20.5 19h-17A1.5 1.5 0 0 1 2 17.5V9.26Z"
    />
  </svg>
);

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* Older browsers and some embedded views block the clipboard API. */
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
};

const CopyEmailButton = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    if (!(await copyText(CONTACT_EMAIL))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className="glass-pill glass-edge" onClick={handleCopy} aria-live="polite">
      {copied ? (
        <>
          <Check className="glass-pill__check" size={20} strokeWidth={2.5} aria-hidden="true" />
          {t("contact.copied")}
        </>
      ) : (
        <>
          <EnvelopeIcon />
          {t("contact.copyEmail")}
        </>
      )}
    </button>
  );
};

const GithubButton = () => (
  <a
    href="https://github.com/adrianskalvis"
    target="_blank"
    rel="noopener noreferrer"
    className="glass-pill glass-edge"
  >
    <Github size={20} aria-hidden="true" />
    GitHub
  </a>
);

/* A quiet one-line hint under a field; it slides open only after a failed Send. */
const FieldHint = ({ id, show, text }: { id: string; show: boolean; text: string }) => {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          id={id}
          className="contact-form__hint"
          role="alert"
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

/* Two plain fields and a row of glass pills: Send, Copy email and GitHub. */
const ContactForm = () => {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const readFields = () => {
    const data = new FormData(formRef.current ?? undefined);
    return { email: String(data.get("email") ?? ""), message: String(data.get("message") ?? ""), data };
  };

  const handleChange = () => {
    if (!attempted) return;
    const { email, message } = readFields();
    setErrors(validate(email, message));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { email, message, data } = readFields();
    /* Bots fill the hidden field; people never see it. */
    if (data.get("_honey")) return;

    const nextErrors = validate(email, message);
    setAttempted(true);
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.message) {
      form.querySelector<HTMLElement>(nextErrors.email ? "input[name=email]" : "textarea[name=message]")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          _subject: "New message from your portfolio",
          _template: "box",
          _captcha: "false",
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === "false" || result.success === false) throw new Error("send failed");
      setStatus("sent");
      setAttempted(false);
      setErrors({});
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const fade = {
    initial: reduceMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: reduceMotion ? undefined : { opacity: 0, y: -8 },
    transition: { duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  const sendButton =
    status === "sent" ? (
      <button type="button" className="glass-pill glass-edge" onClick={() => setStatus("idle")}>
        <Check className="glass-pill__check" size={20} strokeWidth={2.5} aria-hidden="true" />
        {t("contact.sent")}
      </button>
    ) : (
      <button type="submit" form="contact-form" className="glass-pill glass-edge" disabled={status === "sending"}>
        <Send size={18} aria-hidden="true" />
        {status === "sending" ? t("contact.sending") : t("contact.send")}
      </button>
    );

  return (
    <div className="contact-form">
      <AnimatePresence mode="wait" initial={false}>
        {status !== "sent" && (
          <motion.div key="form" {...fade}>
          <form
            ref={formRef}
            id="contact-form"
            className="contact-form__fields"
            onSubmit={handleSubmit}
            onChange={handleChange}
            noValidate
          >
            <label className={`contact-form__field ${errors.email ? "is-invalid" : ""}`}>
              <span className="sr-only">{t("contact.emailLabel")}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder={String(t("contact.emailLabel"))}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "contact-email-hint" : undefined}
              />
              <FieldHint id="contact-email-hint" show={Boolean(errors.email)} text={String(t("contact.emailHint"))} />
            </label>
            <label className={`contact-form__field ${errors.message ? "is-invalid" : ""}`}>
              <span className="sr-only">{t("contact.messageLabel")}</span>
              <textarea
                name="message"
                rows={4}
                placeholder={String(t("contact.messagePlaceholder"))}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "contact-message-hint" : undefined}
              />
              <FieldHint id="contact-message-hint" show={Boolean(errors.message)} text={String(t("contact.messageHint"))} />
            </label>
            <input className="contact-form__honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {status === "error" && (
              <p className="contact-form__error" role="alert">
                {t("contact.error")} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            )}
          </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="contact-form__actions">
        {sendButton}
        <CopyEmailButton />
        <GithubButton />
      </div>
    </div>
  );
};

export default ContactForm;
