import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Brain, Bug, Database, FileText, Key, KeyIcon, Lightbulb, MessageSquareCode, RefreshCcw, Trash, WandSparkles, EyeIcon, EyeOffIcon, } from "lucide-react";

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
import ScoreGuage from "@/components/charts/ScoreGuage";
import ProgressBoxes from "@/components/ProgressBoxes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import DetailedErrors from "@/components/DetailedErrors";
import { Modal, ModalContent, ModalFooter, ModalTrigger } from "@/components/velora/animated-modal";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const CodeReviewPage = () => {
  const [isNoContent, setIsNoContent] = useState(false);
  const [screens, setScreens] = useState("analyze")
  const [seeAPIKey, setSeeAPIKey] = useState(false);
  const toggleAPIKeyVisibility = () => {
    setSeeAPIKey(!seeAPIKey);
  };
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

  const progressBoxes = [
    {
      name: 'Code Quality',
      score: 70
    },
    {
      name: 'Code Readability',
      score: 80
    },
    {
      name: 'Code Performance',
      score: 10
    }
  ]

  // const criticalIssues = []
  const criticalIssues = [
    {

      title: "SQL Injection Risk",
      description:
        "Direct concatenation of parameters into query string at line 2. hkhakwjhdjkawhdjkahwkjdhawhjdbabwmdamnwdmanwdnawdmanwdbmanwbndnmabmwbdam",
      severity: "critical",
      category: "security",
      line: 2,
      icon: "shield-alert",
    },
    {

      title: "Infinite Loop",
      description:
        "While loop at line 5 lacks a definitive escape condition for network failure.",
      severity: "critical",
      category: "performance",
      line: 5,
      icon: "refresh-cw",
    },
    {

      title: "Hardcoded API Secret",
      description:
        "Sensitive API credentials are hardcoded in the source code and may be exposed.",
      severity: "critical",
      category: "security",
      line: 12,
      icon: "key-round",
    },
    {

      title: "Remote Code Execution",
      description:
        "Untrusted input is passed to an execution function, potentially allowing arbitrary code execution.",
      severity: "critical",
      category: "security",
      line: 18,
      icon: "terminal",
    },
    {

      title: "Sensitive Data Exposure",
      description:
        "User credentials and authentication tokens are written to application logs.",
      severity: "critical",
      category: "security",
      line: 24,
      icon: "lock-keyhole",
    },
    {

      title: "Missing Authentication Check",
      description:
        "A protected API endpoint processes requests without verifying the user's identity.",
      severity: "critical",
      category: "security",
      line: 31,
      icon: "shield-alert",
    },
    {

      title: "Unsafe HTML Injection",
      description:
        "Untrusted HTML content is rendered without sanitization, potentially enabling XSS attacks.",
      severity: "critical",
      category: "security",
      line: 38,
      icon: "code",
    },
    {

      title: "Unbounded Retry Loop",
      description:
        "Failed network requests are retried indefinitely without a maximum retry count or backoff strategy.",
      severity: "critical",
      category: "reliability",
      line: 45,
      icon: "repeat",
    },
    {

      title: "Race Condition",
      description:
        "Concurrent operations modify shared state without synchronization, potentially causing inconsistent results.",
      severity: "critical",
      category: "concurrency",
      line: 52,
      icon: "git-branch",
    },
    {
      title: "Uncaught Promise Rejection",
      description:
        "An asynchronous operation can fail without proper error handling, causing unexpected application behavior.",
      severity: "critical",
      category: "reliability",
      line: 61,
      icon: "alert-triangle",
    },
  ];

  const warnings = [
    {
      id: 1,
      title: "Unused Variable",
      description:
        "Variable 'userData' is declared but never used, increasing unnecessary code clutter.",
      severity: "warning",
      category: "code-quality",
      line: 8,
      icon: "circle-alert",
    },
    {
      id: 2,
      title: "Missing React Key",
      description:
        "Elements rendered inside a list are missing a unique key prop, which may cause rendering inconsistencies.",
      severity: "warning",
      category: "react",
      line: 15,
      icon: "list-check",
    },
    {
      id: 3,
      title: "Missing useEffect Dependency",
      description:
        "The useEffect hook references a variable that is missing from its dependency array, potentially causing stale values.",
      severity: "warning",
      category: "react",
      line: 23,
      icon: "git-branch",
    },
    {
      id: 4,
      title: "Unnecessary Re-render",
      description:
        "A new object is created on every render, potentially triggering unnecessary child component re-renders.",
      severity: "warning",
      category: "performance",
      line: 31,
      icon: "refresh-cw",
    },
    {
      id: 5,
      title: "Missing Error Handling",
      description:
        "The API request does not handle failed responses, which may leave the UI in an unexpected state.",
      severity: "warning",
      category: "reliability",
      line: 39,
      icon: "alert-triangle",
    },
    {
      id: 6,
      title: "Hardcoded Configuration",
      description:
        "The API base URL is hardcoded instead of being managed through environment-specific configuration.",
      severity: "warning",
      category: "maintainability",
      line: 46,
      icon: "settings",
    },
    {
      id: 7,
      title: "Potential Memory Leak",
      description:
        "An asynchronous operation updates component state after unmounting because cleanup or cancellation is missing.",
      severity: "warning",
      category: "performance",
      line: 54,
      icon: "memory-stick",
    },
    {
      id: 8,
      title: "Direct DOM Manipulation",
      description:
        "The component modifies DOM elements directly instead of using React state, refs, or declarative rendering where appropriate.",
      severity: "warning",
      category: "react",
      line: 62,
      icon: "code",
    },
    {
      id: 9,
      title: "Missing Input Validation",
      description:
        "User-provided input is processed without sufficient validation, potentially causing unexpected behavior.",
      severity: "warning",
      category: "validation",
      line: 70,
      icon: "shield-alert",
    },
    {
      id: 10,
      title: "Large Component",
      description:
        "The component combines multiple responsibilities and could be split into smaller, reusable components.",
      severity: "warning",
      category: "maintainability",
      line: 85,
      icon: "component",
    },
  ];

  const securityIssues = [
    {
      id: 1,
      title: "SQL Injection",
      description:
        "User-controlled input is concatenated directly into an SQL query, potentially allowing unauthorized database access.",
      severity: "critical",
      category: "injection",
      line: 2,
      icon: "database",
    },
    {
      id: 2,
      title: "Hardcoded API Secret",
      description:
        "A sensitive API key is embedded in the source code and could be exposed through version control or client-side bundles.",
      severity: "critical",
      category: "secrets-management",
      line: 12,
      icon: "key-round",
    },
    {
      id: 3,
      title: "Cross-Site Scripting (XSS)",
      description:
        "Untrusted content is rendered as HTML without adequate sanitization, potentially enabling script injection.",
      severity: "critical",
      category: "injection",
      line: 18,
      icon: "code",
    },
    {
      id: 4,
      title: "Missing Authentication",
      description:
        "A protected resource is accessible without verifying the identity of the requesting user.",
      severity: "critical",
      category: "authentication",
      line: 25,
      icon: "shield-alert",
    },
    {
      id: 5,
      title: "Broken Access Control",
      description:
        "The application does not adequately verify resource ownership or user permissions before allowing sensitive operations.",
      severity: "critical",
      category: "authorization",
      line: 32,
      icon: "lock-keyhole",
    },
    {
      id: 6,
      title: "Sensitive Data Exposure",
      description:
        "Authentication tokens or confidential user information are written to application logs.",
      severity: "critical",
      category: "data-protection",
      line: 40,
      icon: "eye",
    },
    {
      id: 7,
      title: "Insecure Direct Object Reference",
      description:
        "A resource is retrieved using a user-supplied identifier without verifying that the requester has permission to access it.",
      severity: "high",
      category: "authorization",
      line: 47,
      icon: "file-warning",
    },
    {
      id: 8,
      title: "Missing CSRF Protection",
      description:
        "A state-changing request relies on cookie-based authentication without appropriate cross-site request forgery protections.",
      severity: "high",
      category: "request-security",
      line: 54,
      icon: "shield-check",
    },
    {
      id: 9,
      title: "Insecure Storage of Tokens",
      description:
        "Authentication tokens are stored in localStorage, increasing exposure if an XSS vulnerability is exploited.",
      severity: "high",
      category: "session-management",
      line: 61,
      icon: "database",
    },
    {
      id: 10,
      title: "Missing Input Validation",
      description:
        "Untrusted input is processed without adequate validation, potentially enabling injection or unexpected application behavior.",
      severity: "medium",
      category: "input-validation",
      line: 68,
      icon: "shield-alert",
    },
    {
      id: 11,
      title: "Insecure HTTP Request",
      description:
        "Sensitive information may be transmitted over an unencrypted HTTP connection instead of HTTPS.",
      severity: "high",
      category: "transport-security",
      line: 75,
      icon: "globe",
    },
    {
      id: 12,
      title: "Overly Permissive CORS",
      description:
        "The server may allow untrusted origins to access protected resources due to overly permissive cross-origin settings.",
      severity: "medium",
      category: "configuration",
      line: 82,
      icon: "shield",
    },
  ];



  return (
    <section className="mx-5 flex gap-4 pt-14">
      {/* Code Editor */}
      <div className="w-[45%] rounded-md bg-card p-4 shadow">
        {/* Title & Language Selector*/}
        <div className="flex items-center justify-between gap-1">
          <div>
            <h2 className="text-xl font-semibold">Enter your Code</h2>
            <p className="text-sm text-muted-foreground">
              Paste your code below and get AI powered review with suggestions
            </p>
          </div>

          {/* Language Selector */}
          <Combobox items={codingLanguage} defaultValue={codingLanguage[0]}>
            <ComboboxInput placeholder="Choose Language" />
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

        {/* Action Buttons*/}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Button className="p-4 text-balance hover:bg-secondary/90">
            <WandSparkles className="size-4" />
            Review with AI
          </Button>
          <Button variant='outline' className='bg-transparent p-4 font-medium text-balance hover:bg-primary/10'>
            <Bug className="size-4" />
            Fix Code
          </Button>
          <Button variant='outline' className='bg-transparent p-4 font-medium text-balance hover:bg-primary/10'>
            <Brain className="size-4" />
            Explain Code
          </Button>
          <Button
            variant="outline"
            className="bg-transparent p-4 font-medium text-balance hover:bg-primary/10"
          >
            <Trash className="size-4" />
            Clear Code
          </Button>
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

        {/* Usage */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Database />
            <p>Free uses left: 0 / 5</p>
          </div>

          <Modal>
            <ModalTrigger className="bg-primary p-3.5 font-medium text-balance"> <KeyIcon className="size-4" /> Add API Key</ModalTrigger>
            <ModalContent
              title="Add API Key"
              className='text-foreground'
              description="Add your API key to get unlimited code reviews"
            >
              <div className=" mx-5 mt-4 my-4">
                <div className="rounded-lg bg-primary/10 p-3 flex flex-col gap-1">
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
                <Separator className='my-4' />
                <Field className="">
                  <FieldLabel htmlFor="inline-end-input">API Key</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="inline-end-input"
                      type={seeAPIKey ? 'text' : 'password'}
                      placeholder="AIza..."
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={toggleAPIKeyVisibility}
                        className='cursor-pointer text-muted-foreground hover:text-foreground'
                        aria-label={seeAPIKey ? 'Hide API key' : 'Show API key'}
                      >
                        {seeAPIKey ? <EyeOffIcon className='w-4 h-4' /> : <EyeIcon className='w-4 h-4' />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                <ModalFooter className="bg-transparent mt-4 p-0 border-none">
                  <Button
                    type="button"
                    className='w-fit p-5'
                  >
                    Test API Key
                  </Button>
                </ModalFooter>
              </div>
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* Result Preview */}
      <div className="w-[55%] overflow-y-auto rounded-md bg-card p-4 shadow">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">AI Code Review Results</h2>
          <p className="text-sm text-muted-foreground">
            Paste your code below and get AI powered review with suggestions
          </p>
        </div>

        {/* No content message */}
        {
          isNoContent && (
            <div className="flex flex-col justify-center items-center mt-4 h-[90%]">
              <MessageSquareCode />
              <h3 className="text-xl font-semibold">No Results Yet</h3>
              <p className="text-sm text-muted-foreground">Your AI review, explanation will appear here after you run an action.</p>
            </div>
          )
        }

        {/* Screens */}
        {
          screens === "analyze" && !isNoContent ? (
            <div className="pt-4 flex flex-col gap-4">
              {/* Overall Score and Progress Boxes */}
              <div className="flex justify-between items-center">
                {/* Overall Score */}
                <div className="flex items-center gap-2.5 border-[0.5px] border-muted-foreground/20 rounded-md px-2 py-2.5 shadow">
                  <ScoreGuage score={90} size={55} strokeWidth={7} />
                  <div className="flex flex-col gap-0.5">
                    <h4 className="text-balance font-medium">Overall Score </h4>
                    <p className="text-xs text-muted-foreground">Analysis completed</p>
                  </div>
                </div>

                {/* Progress Boxes */}
                {
                  progressBoxes?.map((box) => (
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, est. Ullam fugiat vero odio deserunt quidem itaque delectus repudiandae, quibusdam maiores esse repellat, odit mollitia iste aut iusto! Doloremque, porro.
                </p>
              </div>

              {/* Criticals and Warnings */}
              <DetailedErrors heading="Critical Issues" description={criticalIssues} />
              <DetailedErrors heading="Warnings" description={warnings} />
              <DetailedErrors heading="Security Issues" description={securityIssues} />

              {/* Pro Tip */}
              <div className="border border-muted-foreground/20 rounded p-2 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="text-base" />
                  <h4 className="text-lg font-semibold">Pro Tip</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, est. Ullam fugiat vero odio deserunt quidem itaque delectus repudiandae, quibusdam maiores esse repellat, odit mollitia iste aut iusto! Doloremque, porro.
                </p>
              </div>
            </div>
          ) : screens === "explain" && !isNoContent ? (
            <>
            </>
          ) : ""
        }
      </div>
    </section>
  );
};

export default CodeReviewPage;
