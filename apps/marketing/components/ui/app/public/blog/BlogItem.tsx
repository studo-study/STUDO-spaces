"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import BaseButton from "@studo/ui/design_system/button/BaseButton";
import Container from "@studo/ui/design_system/container/Container";

interface BlogItemProps {
  category: { key: string; questions: string[]; isOpen: boolean };
}

const BlogItem = (props: BlogItemProps) => {
  const { category } = props;
  const t = useTranslations("landing.faq");
  const [isOpen, setIsOpen] = useState<boolean>(category.isOpen);
  const handleIsOpen = () => setIsOpen((prev) => !prev);
  return (
    <section className="flex flex-col gap-6">
      <Container className={"p-6"}>
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="font-bold text-2xl">
            {t(`categories.${category.key}.title`)}
          </h2>
          <BaseButton
            onClick={handleIsOpen}
            icon={
              isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
            }
          />
        </div>
        <div className={`${isOpen ? "" : "hidden"}`}>
          <div className="flex flex-col gap-6 pb-10">
            {category.questions.map((q) => (
              <div key={q} className="flex flex-col gap-2">
                <h3 className="font-bold text-xl">
                  {t(`categories.${category.key}.${q}.question`)}
                </h3>
                <p className="text-lg leading-relaxed">
                  {t(`categories.${category.key}.${q}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

BlogItem.displayName = "BlogItem";
export default BlogItem;
