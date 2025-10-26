import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is TeeSpark?",
    answer:
      "TeeSpark is a digital marketplace where designers can upload and sell their T-shirt designs, and buyers (like printing companies or individuals) can purchase licenses to use these designs.",
  },
  {
    question: "How do I start selling my designs?",
    answer:
      "Simply sign up for a 'Designer' account, click the 'Upload' button, and fill out the form with your design details. Once uploaded, your design will be available on the marketplace.",
  },
  {
    question: "What kind of files can I upload?",
    answer:
      "We recommend uploading high-resolution PNG files with transparent backgrounds for the best results on T-shirts. Vector files like SVG or AI are also great.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Payments are processed securely through our platform. You can connect your bank account or PayPal, and payouts are made on a monthly basis once you meet the minimum threshold.",
  },
  {
    question: "What are the licensing terms?",
    answer:
      "When you purchase a design, you get a license for commercial use on a certain number of products. Please check the specific license details for each design before purchasing.",
  },
];

export function Faq() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tighter">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about TeeSpark.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
