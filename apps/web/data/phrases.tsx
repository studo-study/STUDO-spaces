"use client"
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Phrases() {
  const t = useTranslations("phrases");
  const [phrase] = useState(() => {
    const zinnen = [
      t("Nice work"),
      t("Well done"),
      t("Keep on going"),
      t("You got this"),
      t("You're halfway there"),
      t("You're doing great"),
      t("Keep pushing"),
      t("Stay focused"),
      t("You can do it"),
      t("Don't give up"),
      t("Nice progress"),
      t("You're improving"),
      t("Keep up the good work"),
      t("Just a bit more"),
      t("You're on the right track"),
      t("Stay motivated"),
      t("You're stronger than you think"),
      t("Every step counts"),
      t("Believe in yourself"),

      t("Go Kylie, Go"),
      t("Look at you go"),
      t("You're doing amazing, sweetie"),
      t("Slay the day away"),
      t("Main character energy"),
      t("Look at you go, productivity queen"),
      t("Big brain moment"),
      t("Somebody's been studying"),
      t("Ate and left no crumbs"),
      t("Who needs sleep when you have talent?"),
      t("You deserve a little dance break"),
      t("Certified genius mode unlocked"),
      t("Zero chill, maximum brainpower"),
      t("WOW WOW WOW"),
      t("Highkey crushing it right now"),
      t("Congratulations, now get back to work"),
      t("yes, we can - Yoda"),
    ];
    const random = Math.floor(Math.random() * zinnen.length);
    return zinnen[random];
  });

  return phrase;
}
