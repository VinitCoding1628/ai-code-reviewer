import { useMemo } from "react";
import Editor from "@monaco-editor/react";
import { Brain, Bug, Trash, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useTheme } from "@/hooks/useTheme";
import {
  defineCodeRevThemes,
  getCodeRevMonacoTheme,
} from "@/lib/monaco-themes";
import { codingLanguage } from "@/utils/constants";

const CodeReviewPage = () => {
  const { theme } = useTheme();
  const monacoTheme = getCodeRevMonacoTheme(theme);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 12,
      lineHeight: 20,
      roundedSelection: true,
      scrollBeyondLastLine: false,
      renderLineHighlight: "none",
      padding: { top: 12, bottom: 12 },
      automaticLayout: true,
    }),
    []
  );

  

  return (
    <section className="mx-5 flex pt-14">
      {/* Code Editor */}
      <div className="h-full w-1/2 rounded-md bg-card p-4 shadow">
        {/* Title and Code language selection */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Enter your Code</h2>
          <p className="text-sm text-muted-foreground">
            Paste your code below and get AI powered review with suggestions
          </p>
        </div>

        {/* Search box and Action Buttons*/}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Combobox items={codingLanguage} defaultValue={codingLanguage[0]}>
            <ComboboxInput placeholder="Select a coding language" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-transparent p-4 font-medium text-balance hover:bg-primary/10"
            >
              <Trash className="size-4" />
              Clear Code
            </Button>
            <Button className="p-4 text-balance hover:bg-secondary/90">
              <WandSparkles className="size-4" />
              Review with AI
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <Editor
            height="70vh"
            language="javascript"
            defaultValue="// some comment"
            theme={monacoTheme}
            beforeMount={defineCodeRevThemes}
            options={editorOptions}
          />
        </div>

        <div className="mt-3 flex justify-end gap-3">
          <Button variant='outline' className='bg-transparent p-4 font-medium text-balance hover:bg-primary/10'>
            <Bug className="size-4" />
            Fix Code
          </Button>
          <Button variant='outline' className='bg-transparent p-4 font-medium text-balance hover:bg-primary/10'>
            <Brain className="size-4" />
            Explain Code
          </Button>
        </div>
      </div>

      {/* Result Preview */}
      <div className="h-full w-1/2 overflow-y-auto bg-card" />
    </section>
  );
};

export default CodeReviewPage;
