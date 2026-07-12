import { Section } from '@/components/layout/container';

export default function HomePage() {
  return (
    <>
      <Section className="pt-32 pb-20">
        <div className="max-w-4xl">
          <h1 className="text-display-xl font-bold tracking-tighter leading-[0.95]">
            Everything a student{' '}
            <span className="font-serif italic">needs</span> to calculate,
            convert &amp; simplify.
          </h1>
          <p className="mt-8 text-body-lg text-text-secondary max-w-2xl">
            Free calculators and utilities for college, exams, documents and
            your career — fast, private and easy to use.
          </p>
        </div>
      </Section>
    </>
  );
}
