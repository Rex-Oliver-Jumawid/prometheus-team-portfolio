import { frequentlyAskedQuestions } from "../content/faq";
import FAQItem from "./FAQItem";

export default function FAQSection() {
  return (
    <section id="faq" className="prometheus-faq" aria-labelledby="faq-title">
      <div className="prometheus-faq-container">
        <header className="prometheus-faq-header">
          <h2 id="faq-title">Frequently Asked<br />Questions</h2>
        </header>
        <div className="prometheus-faq-list">
          {frequentlyAskedQuestions.map(item => <FAQItem key={item.id} {...item} />)}
        </div>
      </div>
    </section>
  );
}
