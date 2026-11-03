import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Brain, Bug, Database, FileText, Key, KeyIcon, Lightbulb, MessageSquareCode, RefreshCcw, Trash, WandSparkles, EyeIcon, EyeOffIcon, Loader2, Check, CheckCheckIcon } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { codingLanguage, getMonacoLanguage } from "@/utils/constants";
import ScoreGuage from "@/components/charts/ScoreGuage";
import ProgressBoxes from "@/components/ProgressBoxes";
import DetailedErrors from "@/components/DetailedErrors";
import { Modal, ModalContent, ModalFooter } from "@/components/velora/animated-modal";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MultiStepLoader } from "@/components/velora/multi-step-loader";
import { geminiAI, testGeminiAPI } from "@/utils/GeminiAPI";
import MarkdownPreview from "@uiw/react-markdown-preview";
import '../../src/App.css'
import { toast } from "sonner";

const CodeReviewPage = () => {
  // State for screens and loader action
  const [screens, setScreens] = useState("")
  const [loading, setLoading] = useState(false);
  const [loaderAction, setLoaderAction] = useState(null);
  const [testAPIKeyLoading, setTestAPIKeyLoading] = useState(false);

  // State for Language, code, API Reviewed data, Explanation data
  const [language, setLanguage] = useState("")
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [explainCodeData, setExplainCodeData] = useState("");

  // State for API key and Usage
  const [apiKey, setApiKey] = useState("");
  const [apiUsage, setApiUsage] = useState(0);
  const [seeAPIKey, setSeeAPIKey] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKeyTestFeedback, setApiKeyTestFeedback] = useState(null);
  const [testAPIKeyStatus, setTestAPIKeyStatus] = useState(false);
  const [verifiedApiKey, setVerifiedApiKey] = useState("");

  // State for Monaco Editor Theme
  const { theme } = useTheme();
  const monacoTheme = getCodeRevMonacoTheme(theme);

  /** User's verified key for requests; omit to use server-side env default (never shown in UI). */
  const geminiApiKeyForRequests = useMemo(() => {
    if (testAPIKeyStatus && verifiedApiKey.trim()) {
      return verifiedApiKey.trim();
    }
    return undefined;
  }, [testAPIKeyStatus, verifiedApiKey]);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("userApiKey");
    const apiUsageCount = localStorage.getItem("apiUsage");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setVerifiedApiKey(storedApiKey.trim());
      setTestAPIKeyStatus(true);
    } else {
      setApiKey("");
      setVerifiedApiKey("");
      setTestAPIKeyStatus(false);
    }

    if (!apiUsageCount) {
      setApiUsage(0);
      localStorage.setItem("apiUsage", 0);
    } else {
      setApiUsage(JSON.parse(apiUsageCount));
    }
  }, []);

  // Function to toggle API key visibility
  const toggleAPIKeyVisibility = () => {
    setSeeAPIKey(!seeAPIKey);
  };

  // Function to change the language
  const onLanguageChange = (value) => {
    setLanguage(value ?? "");
    setCode("");
  };

  // Function to get the Monaco language
  const monacoLanguage = useMemo(
    () => getMonacoLanguage(language),
    [language]
  );

  // Function to check if the language is valid
  const hasLanguage = Boolean(
    typeof language === "string" && language.trim()
  );

  // Function for editor options
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

  // Function to clear the code
  const clearCode = () => {
    setCode("");
  }

  // AI API Functions
  const reviewCode = async () => {
    setLoading(true);
    let timeout;
    if (!language?.trim() || !code) {
      setLoading(false);
      return;
    }
    try {
      const response = await geminiAI(code, language, "analyze", geminiApiKeyForRequests);
      const res = JSON.parse(response);
      setData(res);
      setScreens("analyze")
      timeout = setTimeout(() => {
        setLoading(false)
      }, 500)
      if (apiUsage <= 5 && !testAPIKeyStatus) {
        const apiUsageCount = apiUsage + 1;
        setApiUsage(apiUsageCount);
        localStorage.setItem("apiUsage", JSON.stringify(apiUsageCount));
      }
    } catch (error) {
      console.error('Error parsing API response', error);
      toast.error('Error while reviewing your code from API')
      timeout = setTimeout(() => {
        setLoading(false);
      }, 500)
      setScreens("");
    }

    return () => clearTimeout(timeout);
  }

  const explainCode = async () => {
    setLoading(true);
    let timeout;
    if (!language?.trim() || !code) {
      setLoading(false);
      return;
    }
    try {
      const response = await geminiAI(code, language, "explain", geminiApiKeyForRequests);
      // const res = JSON.parse(response);
      setExplainCodeData(response);
      setScreens("explain")
      timeout = setTimeout(() => {
        setLoading(false)
      }, 500)
      if (apiUsage <= 5 && !testAPIKeyStatus) {
        const apiUsageCount = apiUsage + 1;
        setApiUsage(apiUsageCount);
        localStorage.setItem("apiUsage", JSON.stringify(apiUsageCount));
      }

    } catch (error) {
      console.error('Error parsing API response', error);
      toast.error('Error while generating explanation for your code from API')
      timeout = setTimeout(() => {
        setLoading(false);
      }, 500)
      setScreens("");
    }

    return () => clearTimeout(timeout);
  }

  const fixCode = async () => {
    setLoading(true);
    let timeout;
    if (!language?.trim() || !code) {
      setLoading(false);
      return;
    }
    try {
      const response = await geminiAI(code, language, "fix", geminiApiKeyForRequests);
      setCode(response);
      setScreens("fix")
      timeout = setTimeout(() => {
        setLoading(false)
      }, 500)
      if (apiUsage <= 5 && !testAPIKeyStatus) {
        const apiUsageCount = apiUsage + 1;
        setApiUsage(apiUsageCount);
        localStorage.setItem("apiUsage", JSON.stringify(apiUsageCount));
      }

    } catch (error) {
      console.error('Error parsing API response', error);
      toast.error('Error while fixing your code using Gemini API')
      timeout = setTimeout(() => {
        setLoading(false);
      }, 500)
      setScreens("");
    }

    return () => clearTimeout(timeout);
  }

  const isCurrentApiKeyVerified =
    Boolean(verifiedApiKey) && apiKey.trim() === verifiedApiKey;


  // Function to test the API key
  const testAPIKey = async () => {
    if (isCurrentApiKeyVerified) return;
    setTestAPIKeyLoading(true);
    setApiKeyTestFeedback(null);
    try {
      const response = await testGeminiAPI(apiKey);
      if (response.success) {
        const trimmed = apiKey.trim();
        setVerifiedApiKey(trimmed);
        setApiKeyModalOpen(false);
        window.setTimeout(() => {
          toast.success("API key is valid");
        }, 200);
        localStorage.setItem("userApiKey", trimmed);
        setTestAPIKeyStatus(true);
      } else {
        const message = response.error ?? "Invalid API key";
        setApiKeyTestFeedback({ type: "error", message });
        setTestAPIKeyStatus(false);
        setVerifiedApiKey("");
      }
    } finally {
      setTestAPIKeyLoading(false);
    }
  };

  // Array for the review loader steps
  const reviewSteps = [
    { text: "Parsing your code" },
    { text: "Scanning for bugs and security issues" },
    { text: "Evaluating code quality" },
    { text: "Checking performance patterns" },
    { text: "Generating recommendations" },
    { text: "Finalizing your review" },
  ];

  // Array for the fix loader steps
  const fixSteps = [
    { text: "Scanning for fixable issues" },
    { text: "Prioritizing critical and safe fixes" },
    { text: "Applying patches to your code" },
    { text: "Improving readability and structure" },
    { text: "Running validation checks" },
    { text: "Preparing updated code" },
  ];

  // Array for the explain loader steps
  const explainSteps = [
    { text: "Parsing your code" },
    { text: "Generating explanation" },
    { text: "Analyzing code complexity" },
    { text: "Evaluating code quality" },
    { text: "Finalizing your explanation" },
  ];

  // Remove API Key function
  const removeAPIKey = () => {
    setApiKey("");
    setVerifiedApiKey("");
    localStorage.removeItem("userApiKey");
    setTestAPIKeyStatus(false);
  };

  // Variable to get the active loader steps
  const activeLoaderSteps =
    loaderAction === "fix" ? fixSteps : loaderAction === "explain" ? explainSteps : reviewSteps;
  const activeLoaderTitle =
    loaderAction === "fix" ? "Applying code fixes" : loaderAction === "explain" ? "Generating explanation" : "Review in progress";

  const freeTierLimitReached = !testAPIKeyStatus && apiUsage >= 5;
  const actionButtonsDisabled =
    !hasLanguage || !code || freeTierLimitReached || loading;

  return (
    <section className="mx-auto flex w-full flex-col gap-4 px-3 pb-3 pt-14 sm:px-5 lg:flex-row lg:items-stretch">
      {/* Code Editor */}
      <div className="flex min-w-0 w-full flex-col rounded-md bg-card p-3 shadow sm:p-4 lg:w-[45%]">
        {/* Title & Language Selector*/}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold sm:text-xl">Enter your Code</h2>
            <p className="text-sm text-muted-foreground">
              Paste your code below and get AI powered review with suggestions
            </p>
          </div>

          {/* Language Selector */}
          <div className="w-full shrink-0 sm:w-44">
            <Combobox
              items={codingLanguage}
              value={language || null}
              onValueChange={onLanguageChange}
            >
              <ComboboxInput placeholder="Choose Language" className="w-full" />
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
          </div>
        </div>

        {/* Action Buttons*/}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
          <Button
            className="w-full px-3 py-2.5 text-balance hover:bg-secondary/90 sm:p-4"
            disabled={actionButtonsDisabled}
            onClick={() => {
              setLoaderAction("review");
              setLoading(true);
              setScreens("");
              reviewCode();
            }}
          >
            <WandSparkles className="size-4 shrink-0" />
            Review with AI
          </Button>
          <Button
            variant='outline'
            className='w-full bg-transparent px-3 py-2.5 font-medium text-balance hover:bg-primary/10 sm:p-4'
            disabled={actionButtonsDisabled}
            onClick={() => {
              setLoaderAction("fix");
              setLoading(true);
              setScreens("");
              fixCode();
            }}
          >
            <Bug className="size-4 shrink-0" />
            Fix Code
          </Button>
          <Button variant='outline' className='w-full bg-transparent px-3 py-2.5 font-medium text-balance hover:bg-primary/10 sm:p-4' disabled={actionButtonsDisabled}
            onClick={
              () => {
                setLoaderAction("explain");
                setLoading(true);
                setScreens("");
                explainCode();
              }
            }
          >
            <Brain className="size-4 shrink-0" />
            Explain Code
          </Button>
          <Button
            variant="outline"
            className="w-full bg-transparent px-3 py-2.5 font-medium text-balance hover:bg-primary/10 sm:p-4"
            disabled={!hasLanguage || !code}
            onClick={() => clearCode()}
          >
            <Trash className="size-4 shrink-0" />
            Clear Code
          </Button>
        </div>

        {/* Code Editor */}
        <div className="mt-3 flex h-[45vh] flex-1 flex-col overflow-hidden rounded-lg border border-border sm:h-[55vh] lg:h-auto lg:min-h-[45vh] xl:min-h-[68vh]">
          <Editor
            height="100%"
            language={monacoLanguage}
            theme={monacoTheme}
            beforeMount={defineCodeRevThemes}
            options={editorOptions}
            onChange={(code) => setCode(code)}
            value={code}
          />
        </div>

        {/* Usage */}
        {testAPIKeyStatus ? (
          <div className="mt-4 flex lg:w-full md:w-full w-fit items-center justify-between gap-3">
            <Check className="size-4 shrink-0 text-green-500 sm:size-5" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="text-sm font-semibold">API key tested successfully</h3>
              <p className="text-sm text-muted-foreground">
                You can now use the key for reviewing, explaining and fixing your code
              </p>
            </div>
            <div className="flex w-fit flex-col gap-2 sm:flex-row lg:flex-col lg:w-48">
              <Button
                type="button"
                variant="outline"
                className="w-fit bg-transparent px-3 py-2.5 font-medium text-balance hover:bg-primary/10 sm:p-4 lg:w-full md:w-fit sm:w-fit"
                onClick={() => setApiKeyModalOpen(true)}
              >
                View API Key
              </Button>
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" type="button" className="w-fit bg-transparent px-3 py-2.5 font-medium text-balance hover:bg-primary/10 sm:p-4 lg:w-full md:w-fit sm:w-fit">
                  Remove API Key
                </Button>}>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove your API key.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={() => removeAPIKey()}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Database className="size-4 shrink-0 sm:size-5" />
              <p>Free uses left: {apiUsage} / 5</p>
            </div>
            <Button
              type="button"
              className="w-full p-3.5 font-medium text-balance sm:w-auto"
              onClick={() => setApiKeyModalOpen(true)}
            >
              <KeyIcon className="size-4" /> Add API Key
            </Button>
          </div>
        )}

        <Modal
          open={apiKeyModalOpen}
          onOpenChange={(open) => {
            setApiKeyModalOpen(open);
            if (!open) setApiKeyTestFeedback(null);
          }}
        >
          <ModalContent
            title={testAPIKeyStatus ? "Your API Key" : "Add API Key"}
            className="text-foreground"
            description={
              testAPIKeyStatus
                ? "View or update your saved API key"
                : "Add your API key to get unlimited code reviews"
            }
          >
            <div className=" mx-5 mt-4 my-4">
              {!testAPIKeyStatus && (
                <>
                  <div className="flex flex-col gap-1 rounded-lg bg-primary/10 p-3">
                    <p className="text-base font-semibold text-muted-foreground">
                      Don&apos;t have an API key?
                    </p>
                    <div className="flex items-center justify-start gap-1 text-sm text-muted-foreground">
                      <span className="min-w-0">Get your free API key from</span>
                      <a
                        href="https://share.google/qUwreQw7CMZzhfcVE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-primary hover:underline"
                      >
                        Google AI Studio
                      </a>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </>
              )}
              <Field className="">
                <FieldLabel htmlFor="inline-end-input">API Key</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    value={apiKey}
                    onChange={(e) => {
                      const next = e.target.value;
                      setApiKey(next);
                      setApiKeyTestFeedback(null);
                      if (next.trim() !== verifiedApiKey) {
                        setTestAPIKeyStatus(false);
                      }
                    }}
                    id="inline-end-input"
                    type={seeAPIKey ? "text" : "password"}
                    placeholder="AIza..."
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={toggleAPIKeyVisibility}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label={seeAPIKey ? "Hide API key" : "Show API key"}
                    >
                      {seeAPIKey ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              {apiKeyTestFeedback?.type === "error" && (
                <p
                  role="alert"
                  className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {apiKeyTestFeedback.message}
                </p>
              )}
              <ModalFooter className="mt-4 border-none bg-transparent p-0">
                <Button
                  type="button"
                  className="w-fit p-5"
                  onClick={testAPIKey}
                  disabled={testAPIKeyLoading || isCurrentApiKeyVerified}
                >
                  {testAPIKeyLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" /> Testing API Key...
                    </span>
                  ) : isCurrentApiKeyVerified ? (
                    <span className="flex items-center gap-2">
                      <Check className="size-4" /> Tested
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Key className="size-4" /> Test API Key
                    </span>
                  )}
                </Button>
              </ModalFooter>
            </div>
          </ModalContent>
        </Modal>
      </div>

      {/* Result Preview */}
      <div className="flex min-w-0 w-full flex-col overflow-hidden rounded-md bg-card p-3 shadow sm:p-4 lg:w-[55%] lg:min-h-0">
        {/* Title */}
        <div className="shrink-0 flex flex-col gap-1">
          {
            screens === "analyze" ? (
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">AI Code Review Results</h2>
                <p className="text-sm text-muted-foreground">
                  Paste your code below and get AI powered review with suggestions
                </p>
              </div>
            ) : screens === "fix" ? (
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">AI Code Fix Results</h2>
                <p className="text-sm text-muted-foreground">
                  Fixed code as per the AI's suggestions.
                </p>
              </div>
            ) : screens === "explain" ? (
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">AI Code Explanation</h2>
                <p className="text-sm text-muted-foreground">
                  Get an explanation of your code from AI.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">No Results Yet</h2>
              </div>
            )
          }
        </div>

        {/* Screens */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {
            screens === "analyze" ? (
              <div className="flex flex-col gap-4 pt-4">
                {/* Overall Score and Progress Boxes */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
                  {/* Overall Score */}
                  <div className="flex w-full items-center gap-2.5 rounded-md border border-muted-foreground/20 px-2 py-2.5 shadow">
                    <ScoreGuage score={data?.overallScore} size={55} strokeWidth={7} />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h4 className="text-balance font-medium">Overall Score </h4>
                      <p className="text-xs text-muted-foreground">Analysis completed</p>
                    </div>
                  </div>

                  {/* Progress Boxes */}
                  {
                    data?.scoreBreakdown?.map((box) => (
                      <ProgressBoxes key={box.name} name={box.name} score={box.score} />
                    ))
                  }
                </div>

                {/* Summary */}
                <div className="border border-muted-foreground/20 rounded p-2 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="text-base" />
                    <h4 className="text-lg font-semibold">Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data?.summary}
                  </p>
                </div>

                {/* Criticals and Warnings */}
                <DetailedErrors heading="Critical Issues" description={data?.critical} />
                <DetailedErrors heading="Warnings" description={data?.warnings} />
                <DetailedErrors heading="Security Issues" description={data?.securityAudit} />

                {/* Pro Tip */}
                <div className="border border-muted-foreground/20 rounded p-2 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="text-base" />
                    <h4 className="text-lg font-semibold">Pro Tip</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data?.proTip}
                  </p>
                </div>
              </div>
            ) : screens === "fix" ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-primary/10 p-10 rounded-lg shadow">
                  <CheckCheckIcon className="size-10 shrink-0 text-primary" />
                  <h4 className="text-xl font-semibold">Code fixed successfully</h4>
                  <p className="text-lg text-muted-foreground text-center">
                    All detected issues have been resolved using AI.
                  </p>
                </div>
              </div>
            ) : screens === "explain" ? (
              <div className="pt-4 min-h-0 flex-1">
                <MarkdownPreview
                  source={explainCodeData}
                  // data-color-mode={theme}

                  wrapperElement={{ "data-color-mode": `${theme}` }}
                  className="max-h-[80vh] overflow-y-auto rounded-lg border border-muted-foreground/20 bg-card p-4 text-foreground [&_.wmde-markdown]:bg-transparent [&_.wmde-markdown]:text-inherit wmde-markdown-var custom-dark-theme"
                />
              </div>
            ) : (
              <div className="flex min-h-[min(60vh,29rem)] flex-1 flex-col items-center justify-center gap-2 px-2 py-8 text-center lg:min-h-0">
                <MessageSquareCode className="size-10 sm:size-12" />
                <h3 className="text-lg font-semibold sm:text-xl">No Results Yet</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Your AI review, explanation will appear here after you run an action.
                </p>
              </div>
            )
          }
        </div>

      </div>

      <MultiStepLoader
        loading={loading}
        steps={activeLoaderSteps}
        duration={1600}
        loop
        title={activeLoaderTitle}
        onComplete={() => {
          const action = loaderAction;
          setLoading(false);
          if (action === "fix") {
            setScreens("fix");
          }
          setLoaderAction(null);
        }}
        onClose={() => {
          setLoading(false);
          setLoaderAction(null);
        }}
      />
    </section>
  );
};

export default CodeReviewPage;
