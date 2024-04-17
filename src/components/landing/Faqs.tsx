import Image from 'next/image'

import { Container } from '@/components/default/Container'
import backgroundImage from '@/images/background-faqs.jpg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  [
    {
      question: 
        'What is Cribbly, and who is it for?',
      answer:
        '',
    },
    {
      question:
        'Why use property management software at all?',
      answer:
        '',
    },
    {
      question:
        'Is property management software suitable for individual landlords or just property management companies?',
      answer:
        '',
    },
  ],
  [
    {
      question: 
        'What types of properties can be managed using property management software?',
      answer:
        '',
    },
    {
      question: 
        'What does Cribbly offer?',
      answer: 
        '',
    },
    {
      question: 
        'How much does Cribbly cost?',
      answer:
        'Cribbly is free for the first three months, and then min(0.35% rent, $10) per month per property.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            We’ve got your questions covered!
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <Accordion key={faqIndex} type="single" collapsible className="">
                      <AccordionItem value={`item-${columnIndex}-${faqIndex}`}>
                      <AccordionTrigger className="font-display text-lg leading-7 text-slate-900 cursor-pointer text-left	">
                      {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="mt-4 text-sm text-slate-700">
                          {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
