import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import Container from '../components/common/Container';
import { apiRequest } from '../lib/api';
import './CTA.css';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

function CTA() {
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setNotice({ type: '', text: '' });
    try {
      await apiRequest('/contacts', { method: 'POST', body: JSON.stringify(form) });
      setForm(initialForm);
      setNotice({ type: 'success', text: 'Thank you. Your inquiry has been sent to HAILANG.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'Your inquiry could not be sent. Please try again.' });
    } finally { setBusy(false); }
  };

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <section id="contact" className="contact-section">
      <Container>
        <div className="contact-shell">
          <div className="contact-copy">
            <p className="eyebrow">Get in touch</p>
            <h2>Let’s find the right fit for your home.</h2>
            <p>Send HAILANG a question about the collection, availability, or product information.</p>
            <div className="contact-note"><span /> Your message goes to the HAILANG team.</div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-fields">
              <label>Your name<input name="name" value={form.name} onChange={update} maxLength={120} autoComplete="name" required /></label>
              <label>Email address<input name="email" type="email" value={form.email} onChange={update} maxLength={254} autoComplete="email" required /></label>
              <label>Phone <span>(optional)</span><input name="phone" type="tel" value={form.phone} onChange={update} maxLength={40} autoComplete="tel" /></label>
              <label>Subject <span>(optional)</span><input name="subject" value={form.subject} onChange={update} maxLength={180} /></label>
              <label className="contact-message-field">How can we help?<textarea name="message" value={form.message} onChange={update} maxLength={4000} rows={4} required /></label>
            </div>
            {notice.text && <p className={'contact-notice ' + notice.type} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.type === 'success' && <CheckCircle2 size={16} />}{notice.text}</p>}
            <button className="contact-submit" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send inquiry'} <Send size={15} aria-hidden="true" /></button>
          </form>
        </div>
      </Container>
    </section>
  );
}
export default CTA;
