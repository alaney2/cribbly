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
        'Cribbly is property management software for small landlords managing homes and apartments. It is the source of truth for all your property management needs, from rent collection to tax preparation. Keep all your data in one place and manage your properties from anywhere with Cribbly.',
    },
    {
      question:
        'Is property management software really necessary?',
      answer:
        'No. But using property management software saves you a lot of time managing rental properties by automating routine tasks like rent collection, taxes, and maintenance scheduling but. It also reduces human error and improves tenant satisfaction.',
    },
    {
      question:
        'Is property management software suitable for individual landlords or just property management companies?',
      answer:
        'It’s suitable for both, scaling efficiently for any number of properties, from one to hundreds. No matter the portfolio size, everyone can benefit from the time and cost savings, improved organization, and enhanced tenant experience that property management software provides.',
    },
  ],
  [
    {
      question: 
      'How much does Cribbly cost?',
      answer:
      'Cribbly is free for the first three months, then $10 per property per month.',
    },
    {
      question: 
      'What does Cribbly offer?',
      answer:
      'Cribbly provides automated online rent payment, real-time financial analytics, maintenance request tracking, and tax report automation in a user-friendly platform. You can also use Cribbly on your phone to manage your properties on the go.', 
    },
    {
      question: 
        'What types of properties can be managed using property management software?',
      answer:
        'All types, including single-family homes, condos, apartments, commercial properties, and more. Cribbly is built for small landlords managing residential properties, but it can be adapted for other property types as well.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 pt-8 py-20 sm:py-32 "
    >
      {/* <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      /> */}
      
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-800 bg-gradient-to-r to-blue-600 from-[#60a4ff] via-indigo-400 inline-block text-transparent bg-clip-text"
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
              <ul role="list" className="flex flex-col gap-y-6">
                {column.map((faq, faqIndex) => (
                  <Accordion key={faqIndex} type="single" collapsible className="">
                    <AccordionItem value={`item-${columnIndex}-${faqIndex}`}>
                      <AccordionTrigger className="font-display text-lg leading-7 text-slate-800 cursor-pointer text-left	">
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
