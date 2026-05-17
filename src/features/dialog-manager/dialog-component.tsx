/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { Typography } from "@/components/nowts/typography";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NeoButton } from "@/components/neo";
import { NeoInput } from "@/components/neo";
import { NeoLabel } from "@/components/neo";
import { NeoSheet } from "@/components/neo/neo-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LoadingButton } from "../form/submit-button";
import { handleDialogAction, useDialogStore } from "./dialog-store";
import type { Dialog } from "./dialog-types";

export function DialogComponent(props: { dialog: Dialog }) {
  const { dialog } = props;
  const isMobile = useIsMobile();
  const [confirmText, setConfirmText] = useState("");
  const [inputValue, setInputValue] = useState(
    dialog.type === "input" ? (dialog.input.defaultValue ?? "") : "",
  );

  const isConfirmDisabled =
    dialog.type === "confirm" && dialog.confirmText
      ? confirmText !== dialog.confirmText
      : false;

  const handleAction = async () => {
    if (dialog.type === "custom") return;
    await handleDialogAction(dialog.id, async () =>
      dialog.action.onClick?.(dialog.type === "input" ? inputValue : undefined),
    );
  };

  const handleCancel = async () => {
    if (dialog.type !== "custom" && dialog.cancel?.onClick) {
      await dialog.cancel.onClick();
    } else {
      useDialogStore.getState().removeDialog(dialog.id);
    }
  };

  // Mobile Implementation (NeoSheet)
  if (isMobile) {
    if (dialog.type === "custom") {
      return (
        <NeoSheet
          open={true}
          onOpenChange={handleCancel}
          title={dialog.title}
          description={
            typeof dialog.description === "string"
              ? dialog.description
              : undefined
          }
        >
          {dialog.children}
        </NeoSheet>
      );
    }

    return (
      <NeoSheet
        open={true}
        onOpenChange={handleCancel}
        title={dialog.title}
        description={
          typeof dialog.description === "string"
            ? dialog.description
            : undefined
        }
      >
        <div className="space-y-6 pt-4">
          {dialog.icon && (
            <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <dialog.icon className="size-6" />
            </div>
          )}

          {typeof dialog.description !== "string" && dialog.description}

          {dialog.type === "confirm" && dialog.confirmText && (
            <div className="space-y-2">
              <Typography>
                Type{" "}
                <Typography variant="code">{dialog.confirmText}</Typography> to
                confirm this action.
              </Typography>
              <NeoInput
                autoFocus
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (!dialog.loading && !isConfirmDisabled) {
                      void handleAction();
                    }
                  }
                }}
              />
            </div>
          )}

          {dialog.type === "input" && (
            <div className="space-y-2">
              <NeoLabel>{dialog.input.label}</NeoLabel>
              <NeoInput
                value={inputValue}
                placeholder={dialog.input.placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!dialog.loading && !isConfirmDisabled) {
                      void handleAction();
                    }
                  }
                }}
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <NeoButton
              variant="outline"
              disabled={dialog.loading}
              onClick={handleCancel}
              className="w-full"
            >
              {dialog.cancel?.label ?? "Cancel"}
            </NeoButton>

            <LoadingButton
              loading={dialog.loading}
              disabled={dialog.loading || isConfirmDisabled}
              onClick={handleAction}
              variant={dialog.action.variant ?? "default"}
              className="w-full"
            >
              {dialog.action.label ?? "OK"}
            </LoadingButton>
          </div>
        </div>
      </NeoSheet>
    );
  }

  // Desktop Implementation (AlertDialog)
  if (dialog.type === "custom") {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          {dialog.title ? (
            <AlertDialogHeader>
              <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
              {dialog.description ? (
                <AlertDialogDescription>
                  {dialog.description}
                </AlertDialogDescription>
              ) : (
                <AlertDialogDescription className="sr-only">
                  Dialog content
                </AlertDialogDescription>
              )}
            </AlertDialogHeader>
          ) : (
            <>
              <AlertDialogTitle className="sr-only">Dialog</AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Dialog content
              </AlertDialogDescription>
            </>
          )}
          {dialog.children}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={true} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader
          className={cn({
            "flex flex-col items-center gap-2": dialog.style === "centered",
          })}
        >
          {dialog.icon && (
            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <dialog.icon className="size-6" />
            </div>
          )}
          <AlertDialogTitle>{dialog.title ?? ""}</AlertDialogTitle>
          {typeof dialog.description === "string" ? (
            <AlertDialogDescription>
              {dialog.description}
            </AlertDialogDescription>
          ) : (
            dialog.description
          )}
        </AlertDialogHeader>

        {dialog.type === "confirm" && dialog.confirmText && (
          <div className="space-y-2">
            <Typography>
              Type <Typography variant="code">{dialog.confirmText}</Typography>{" "}
              to confirm this action.
            </Typography>
            <NeoInput
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (!dialog.loading && !isConfirmDisabled) {
                    void handleAction();
                  }
                }
              }}
            />
          </div>
        )}

        {dialog.type === "input" && (
          <div className="mt-2">
            <NeoLabel>{dialog.input.label}</NeoLabel>
            <NeoInput
              value={inputValue}
              placeholder={dialog.input.placeholder}
              onChange={(e) => setInputValue(e.target.value)}
              ref={(ref) => ref?.focus()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!dialog.loading && !isConfirmDisabled) {
                    void handleAction();
                  }
                }
              }}
            />
          </div>
        )}

        <AlertDialogFooter>
          <NeoButton
            variant="outline"
            disabled={dialog.loading}
            onClick={handleCancel}
          >
            {dialog.cancel?.label ?? "Cancel"}
          </NeoButton>

          <LoadingButton
            loading={dialog.loading}
            disabled={dialog.loading || isConfirmDisabled}
            onClick={handleAction}
            variant={dialog.action.variant ?? "default"}
          >
            {dialog.action.label ?? "OK"}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
