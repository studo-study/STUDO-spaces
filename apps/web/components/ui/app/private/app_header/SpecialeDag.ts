import { useLocale } from "next-intl";

export function SpecialeDag() {
  const date: Date = new Date();
  const dag = date.getDate();
  const maand = date.getMonth();
  const jaar = date.getFullYear();
  const feestdagen = {
    christmas:
      "from-rose-600 via-rose-500 to-rose-400 dark:from-white dark:to-rose-200",
    christmasDay:
      "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
    newYear:
      "from-yellow-700 via-amber-500 to-yellow-400 dark:from-white dark:to-amber-200",
    threeKings:
      "from-amber-600 via-amber-500 to-yellow-500 dark:from-white dark:to-yellow-200",
    labour:
      "from-red-600 via-red-500 to-red-400 dark:from-white dark:to-red-200",
    valentine:
      "from-pink-600 via-pink-500 to-pink-400 dark:from-pink-300 dark:via-pink-300 dark:to-pink-400",
    halloween:
      "from-orange-600 via-orange-500 to-orange-400 dark:from-white dark:to-orange-200",
    easter:
      "from-violet-500 via-violet-400 to-purple-400 dark:from-white dark:to-violet-200",
    stPatricks:
      "from-green-600 via-green-500 to-green-400 dark:from-white dark:to-green-200",
    mothersDay:
      "from-pink-500 via-pink-400 to-rose-400 dark:from-white dark:to-pink-200",
    fathersDay:
      "from-sky-600 via-sky-500 to-sky-400 dark:from-white dark:to-sky-200",
    carnival:
      "from-fuchsia-600 via-fuchsia-500 to-fuchsia-400 dark:from-white dark:via-fuchsia-200 dark:to-fuchsia-200",
    kingsDay:
      "from-orange-500 via-orange-400 to-amber-400 dark:from-white dark:to-orange-200",
    midsummer:
      "from-blue-400 via-green-300 to-amber-300 dark:from-white dark:to-sky-200",
    vs: "from-blue-600 to-red-700 dark:from-blue-600 dark:to-red-400",
    nederland:
      "from-orange-400 via-amber-500 to-orange-300 dark:from-orange-400 dark:via-amber-500 dark:to-orange-300",
  };

  const pasen = berekenPasen(jaar);
  const pasenDatum = new Date(jaar, pasen.maand - 1, pasen.dag);

  const carnaval = new Date(pasenDatum);
  carnaval.setDate(carnaval.getDate() - 49);

  if (dag === pasen.dag && maand === pasen.maand - 1) {
    return feestdagen.easter;
  }
  if (dag === carnaval.getDate() && maand === carnaval.getMonth()) {
    return feestdagen.carnival;
  }

  const key: string = `${dag}/${maand}`;
  const vasteDagen: Record<string, string> = {
    "1/0": feestdagen.newYear,
    "6/0": feestdagen.threeKings,
    "14/1": feestdagen.valentine,
    "17/2": feestdagen.stPatricks,
    "1/4": feestdagen.labour,
    "21/5": feestdagen.midsummer,
    "31/9": feestdagen.halloween,
    "24/11": feestdagen.christmas,
    "25/11": feestdagen.christmasDay,
    "31/11": feestdagen.newYear,
  };

  return (
    vasteDagen[key] ||
    "from-emerald-500 to-emerald-400 dark:from-white dark:to-blue-200"
  );
}

export function SpecialeDagTitel() {
  const date: Date = new Date();
  const dag = date.getDate();
  const maand = date.getMonth();
  const jaar = date.getFullYear();
  const locale = useLocale();
  const pasen = berekenPasen(jaar);
  const pasenDatum = new Date(jaar, pasen.maand - 1, pasen.dag);

  const carnaval = new Date(pasenDatum);
  carnaval.setDate(carnaval.getDate() - 49);

  if (dag === pasen.dag && maand === pasen.maand - 1) {
    return "easters";
  }
  if (dag === carnaval.getDate() && maand === carnaval.getMonth()) {
    return "Vrolijk Carnaval";
  }

  const key: string = `${dag}/${maand}`;
  const vasteDagen: Record<string, string> = {
    "1/0": "Happy New Year!",
    "6/0": "Happy Three Kings' Day",
    "14/1": "Happy Valentine's Day",
    "17/2": "Happy St. Patrick's Day",
    "1/4": "Happy Labour Day",
    "21/5": "Happy Midsummer",
    "31/9": "Happy Halloween",
    "24/11": "Merry Christmas",
    "25/11": "Merry Christmas",
    "31/11": "Happy New Year's Eve",
  };

  if (locale === "nl" && key === "21/6") {
    return "Nationale Feestdag";
  }

  if (locale === "nl" && key === "27/3") {
    return "Koningsdag";
  }

  return vasteDagen[key] || "Holiday";
}

function berekenPasen(jaar: number) {
  const a = jaar % 19;
  const b = Math.floor(jaar / 100);
  const c = jaar % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  const maand = Math.floor((h + l - 7 * m + 114) / 31);
  const dag = ((h + l - 7 * m + 114) % 31) + 1;

  return { dag, maand };
}
