import { SlCalender } from "react-icons/sl";
import { HiTrendingUp } from "react-icons/hi";
import { LuUserRoundSearch } from "react-icons/lu";
import { TbLanguageHiragana } from "react-icons/tb";
import { steps as stepData } from "@/constants/steps";
import { SectionHeading, Tagline, Heading, Description } from "@/marketing";

const icons = [TbLanguageHiragana, LuUserRoundSearch, SlCalender, HiTrendingUp];

export default function HowItWorksSection() {
  const features = stepData.map((step, index) => ({
    icon: icons[index],
    text: step.title,
    desc: step.desc,
  }));

  return (
    <SectionHeading>
      {/* SECTION HEADER */}
      <Tagline>How It Works</Tagline>
      <Heading className="mt-4">
        Learning a New Language Shouldn&apos;t Be Complicated.
      </Heading>
      <Description>
        Here&apos;s how we make it fast, easy, and effective to start speaking a
        plethora of African languages without stress or guesswork.
      </Description>

      {/* STEPS */}
      <div className="mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        {features.map((feature, index) => (
          <article
            key={index}
            className="rounded-2xl border border-nawalingo-dark/10 bg-nawalingo-dark/5 px-6 py-8 text-left backdrop-blur-md dark:border-nawalingo-light/10 dark:bg-nawalingo-light/5"
          >
            <feature.icon className="mb-2 h-8 w-8 text-nawalingo-primary" />
            <h3 className="text-lg font-bold text-nawalingo-dark capitalize dark:text-nawalingo-light">
              {feature.text}
            </h3>
            <p className="text-nawalingo-dark/50 md:text-lg dark:text-nawalingo-light/50">
              {feature.desc}
            </p>
          </article>
        ))}
      </div>
    </SectionHeading>
  );
}
