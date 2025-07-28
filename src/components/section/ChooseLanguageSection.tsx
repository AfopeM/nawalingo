import Link from "next/link";
import { Button } from "@/common/Button";
import SectionHeading from "@/common/SectionHeading";
import { IoLanguageSharp } from "react-icons/io5";
import { Tagline, Heading, Description } from "@/common/Typography";
import { mostPopularLanguages as mostPopularLanguageData } from "@/constants/languages";

export default function ChooseLanguageSection() {
  return (
    <SectionHeading>
      {/* SECTION HEADER */}
      <Tagline>level up your fluency</Tagline>
      <Heading className="mt-4">choose your language</Heading>
      <Description>
        Whether you&apos;re learning for travel, heritage, or career. Our
        lessons help you speak like a local, not a tourist. Here are most
        popular languages
      </Description>

      {/* LANGUAGES */}
      <div className="my-10 grid grid-cols-1 gap-4 justify-self-center text-center md:grid-cols-2">
        {mostPopularLanguageData.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex max-w-xs flex-col items-center rounded-xl border border-nawalingo-dark/10 bg-nawalingo-dark/5 p-6 backdrop-blur-sm dark:border-nawalingo-light/10 dark:bg-nawalingo-light/5`}
            >
              <IoLanguageSharp className="mb-2 h-8 w-8 text-nawalingo-primary" />
              <h4 className="text-xl font-black text-nawalingo-dark uppercase dark:text-nawalingo-light">
                {item.language}
              </h4>
              <p className="text-nawalingo-dark/50 dark:text-nawalingo-light/50">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* BUTTON */}
      <Link href="/main/languages">
        <Button size="lg" className="py-6 font-bold tracking-wide uppercase">
          learn more
        </Button>
      </Link>
    </SectionHeading>
  );
}
