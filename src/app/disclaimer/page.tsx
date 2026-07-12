import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Disclaimer | ${siteConfig.name}`,
  description: 'Important disclaimers about StudentKit calculator results and tool limitations.',
};

export default function DisclaimerPage() {
  return (
    <div className="py-8 md:py-16">
      <div className="container-main max-w-3xl">
        <h1 className="text-h1 font-bold tracking-tight">Disclaimer</h1>

        <div className="mt-8 space-y-8 text-[var(--text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              General disclaimer
            </h2>
            <p>
              The information and results provided by StudentKit tools are for
              general informational and educational purposes only. They do not
              constitute professional advice of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Academic calculators
            </h2>
            <p>
              GPA, CGPA, SGPA, and attendance calculations are based on standard
              formulas. Different institutions may use different grading systems,
              credit structures, or attendance policies. Always refer to your
              college or university&apos;s official guidelines for authoritative
              results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Salary and financial tools
            </h2>
            <p>
              The CTC to in-hand salary calculator and salary tools provide
              estimates only. Actual salary components, tax calculations, and
              deductions depend on your specific employer policies, tax regime
              choice, investment declarations, and applicable regulations. Consult
              a tax professional or your HR department for accurate figures.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              CGPA to percentage conversion
            </h2>
            <p>
              Conversion formulas vary by university. The formulas provided are
              commonly used approximations. For official purposes (job
              applications, higher education admissions), use only the formula
              specified by the relevant institution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              Image processing tools
            </h2>
            <p>
              Image compression and resizing are performed using browser-native
              APIs. Results may vary slightly across different browsers and
              devices. For critical applications, verify the output meets your
              specific requirements before submission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              No liability
            </h2>
            <p>
              StudentKit, its creators, and contributors shall not be held liable
              for any decisions made or actions taken based on the information
              provided by these tools. Use at your own discretion and verify
              results independently when accuracy is critical.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
