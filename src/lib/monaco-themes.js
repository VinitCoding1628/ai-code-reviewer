/** Matches `--code-editor` in index.css */
const CODE_EDITOR_LIGHT = "#f5fbf9";
const CODE_EDITOR_DARK = "#0f3729";

export function defineCodeRevThemes(monaco) {
  monaco.editor.defineTheme("codeRev-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": CODE_EDITOR_LIGHT,
    },
  });

  monaco.editor.defineTheme("codeRev-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": CODE_EDITOR_DARK,
    },
  });
}

export function getCodeRevMonacoTheme(appTheme) {
  return appTheme === "dark" ? "codeRev-dark" : "codeRev-light";
}
