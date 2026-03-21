import { ReactNode } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import json from "highlight.js/lib/languages/json";
hljs.registerLanguage("json", json);
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);
hljs.registerAliases(["js", "javascript"], { languageName: "javascript" });
import typescript from "highlight.js/lib/languages/typescript";
hljs.registerLanguage("typescript", typescript);
hljs.registerAliases(["ts", "typescript"], { languageName: "typescript" });
import css from "highlight.js/lib/languages/css";
hljs.registerLanguage("css", css);
import scss from "highlight.js/lib/languages/scss";
hljs.registerLanguage("scss", scss);
import xml from "highlight.js/lib/languages/xml";
hljs.registerLanguage("xml", xml);
import yaml from "highlight.js/lib/languages/yaml";
hljs.registerLanguage("yaml", yaml);
import graphql from "highlight.js/lib/languages/graphql";
hljs.registerLanguage("graphql", graphql);
import c from "highlight.js/lib/languages/c";
hljs.registerLanguage("c", c);
import cpp from "highlight.js/lib/languages/cpp";
hljs.registerLanguage("cpp", cpp);
import python from "highlight.js/lib/languages/python";
hljs.registerLanguage("python", python);
import go from "highlight.js/lib/languages/go";
hljs.registerLanguage("go", go);
import rust from "highlight.js/lib/languages/rust";
hljs.registerLanguage("rust", rust);
import java from "highlight.js/lib/languages/java";
hljs.registerLanguage("java", java);
import bash from "highlight.js/lib/languages/bash";
hljs.registerLanguage("bash", bash);
import sql from "highlight.js/lib/languages/sql";
hljs.registerLanguage("sql", sql);
import pgsql from "highlight.js/lib/languages/pgsql";
hljs.registerLanguage("pgsql", pgsql);
import dockerfile from "highlight.js/lib/languages/dockerfile";
hljs.registerLanguage("dockerfile", dockerfile);

export function Code({ children, ...props }: { children: ReactNode }) {
  const { className } = props as any;
  const language = className?.replace("language-", "") || "js";
  const highlightedCode = hljs.highlight(children as string, {
    language,
  }).value;

  return (
    <div>
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      ></code>
    </div>
  );
}
