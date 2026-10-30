"use client";;
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};

const ModalContext = createContext(null);

function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal parts must be inside <Modal>");
  return ctx;
}

/**
 * Dialog built on the native `<dialog>` element: the panel springs in with a
 * slight tilt over a blurred backdrop, and plays its exit before closing.
 * Compose `ModalTrigger`, `ModalContent`, `ModalFooter` and `ModalClose`.
 */
export function Modal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const triggerRef = useRef(null);
  const setOpen = (next) => {
    if (openProp === undefined) setInner(next);
    onOpenChange?.(next);
  };

  return (
    <ModalContext.Provider value={{ open, setOpen, id: useId(), triggerRef }}>
      {children}
    </ModalContext.Provider>
  );
}

/** Button that opens the modal. */
export function ModalTrigger({
  className,
  onClick,
  ...props
}) {
  const { open, setOpen, id, triggerRef } = useModal();
  return (
    <button
      type="button"
      {...props}
      ref={triggerRef}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={id}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    />
  );
}

/** The dialog panel. Only mounted while open (or animating out). */
export function ModalContent({
  title,
  description,
  showCloseButton = true,
  className,
  children,
  "aria-labelledby": labelledBy,
  ...props
}) {
  const { open, setOpen, id, triggerRef } = useModal();
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const returnFocus = useRef(null);
  const downOutside = useRef(false);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduce = useReducedMotion() === true && hydrated;

  // Open before paint so the enter animation starts on a visible dialog.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || dialog.open) return;
    returnFocus.current = document.activeElement;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
  }, [open]);

  // However it closes (animation done, double Escape), unlock and hand focus back.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      const back = returnFocus.current;
      (back && back !== document.body ? back : triggerRef.current)?.focus({
        preventScroll: true,
      });
      if (open) setOpen(false);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  });

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
    },
    []
  );

  const outside = (target) =>
    !panelRef.current?.contains(target);
  const spring = reduce
    ? { duration: 0.15 }
    : { type: "spring", stiffness: 380, damping: 30 };
  const hidden = reduce
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.9, rotateX: 14, y: 24 };

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={labelledBy ?? (title ? `${id}-title` : undefined)}
      aria-describedby={description ? `${id}-desc` : undefined}
      onCancel={(event) => {
        // Escape: run the exit animation instead of closing instantly.
        event.preventDefault();
        setOpen(false);
      }}
      onPointerDown={(event) => (downOutside.current = outside(event.target))}
      onClick={(event) => {
        if (downOutside.current && outside(event.target)) setOpen(false);
      }}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-y-auto border-0 bg-transparent p-0 text-foreground outline-none backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {open && (
          <div className="grid min-h-full place-items-center p-4 perspective-distant">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div
              {...props}
              ref={panelRef}
              initial={hidden}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              exit={hidden}
              transition={spring}
              data-slot="modal-content"
              className={cn(
                "relative w-full max-w-lg overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl",
                className
              )}
            >
              {(title || description) && (
                <div className="px-6 pt-6 pr-10">
                  {title && (
                    <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={`${id}-desc`} className="text-sm text-muted-foreground pt-1">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {children}
              {showCloseButton && (
                <ModalClose
                  aria-label="Close"
                  className="absolute top-4 right-4 size-8 border-0 bg-transparent p-0 text-muted-foreground"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </ModalClose>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

/** Action row pinned to the bottom of the panel. */
export function ModalFooter({
  className,
  ...props
}) {
  return (
    <div
      {...props}
      data-slot="modal-footer"
      className={cn(
        "flex flex-wrap items-center justify-end gap-2 border-t bg-muted/40 px-6 py-4",
        className
      )}
    />
  );
}

/** Button that closes the modal (with its exit animation). */
export function ModalClose({
  className,
  onClick,
  ...props
}) {
  const { setOpen } = useModal();
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border bg-background px-3.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    />
  );
}
