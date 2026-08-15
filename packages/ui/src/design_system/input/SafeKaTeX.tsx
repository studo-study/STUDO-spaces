"use client";
import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.mjs";

const SafeKaTeX = ({ value }: { value: string }) => {
  const html = useMemo(
    () =>
      katex.renderToString(value, { throwOnError: false, displayMode: false }),
    [value],
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default SafeKaTeX;
