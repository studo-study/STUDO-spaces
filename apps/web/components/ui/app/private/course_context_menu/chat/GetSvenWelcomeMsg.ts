import { useTranslations } from "next-intl";

export function getSvenWelcomeMsg(
  t: ReturnType<typeof useTranslations>,
  name: string,
): string {
  const time = new Date().getHours();
  const ranges = [
    { from: 0, to: 1, key: "0" },
    { from: 2, to: 3, key: "2" },
    { from: 4, to: 6, key: "4" },
    { from: 7, to: 10, key: "7" },
    { from: 11, to: 14, key: "11" },
    { from: 15, to: 18, key: "15" },
    { from: 19, to: 21, key: "19" },
    { from: 22, to: 23, key: "22" },
  ];

  const match = ranges.find((r) => time >= r.from && time <= r.to);
  if (!match) return `Welcome back, ${name}`;

  try {
    const messages = t.raw(match.key) as string[];
    return messages[Math.floor(Math.random() * messages.length)].replace(
      "{name}",
      name,
    );
  } catch {
    return `Welcome back, ${name}`;
  }
}
