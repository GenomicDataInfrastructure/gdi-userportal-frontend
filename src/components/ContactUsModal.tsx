// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useMemo, useState } from "react";
import AppButton from "@/components/Button";
import { Button as DialogButton } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";

type TopicOption = {
  value: string;
  label: string;
};

type ContactFormState = {
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  title: string;
  message: string;
};

const INITIAL_FORM_STATE: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  topic: "",
  title: "",
  message: "",
};

function isValidEmailFormat(value: string): boolean {
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.value = value;
  return emailInput.checkValidity();
}

export default function ContactUsModal() {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [formState, setFormState] =
    useState<ContactFormState>(INITIAL_FORM_STATE);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isTopicAvailable = useMemo(() => topics.length > 0, [topics.length]);

  useEffect(() => {
    if (!open || topics.length > 0 || isLoadingTopics) {
      return;
    }

    const loadTopics = async () => {
      setIsLoadingTopics(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/helpdesk/topics", {
          method: "GET",
        });
        const responseBody = (await response.json()) as {
          topics?: TopicOption[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            responseBody.error || "Unable to load support topic options."
          );
        }

        const loadedTopics = responseBody.topics ?? [];
        setTopics(loadedTopics);

        if (loadedTopics.length > 0) {
          setFormState((previousState) => ({
            ...previousState,
            topic: previousState.topic || loadedTopics[0].value,
          }));
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load support topic options."
        );
      } finally {
        setIsLoadingTopics(false);
      }
    };

    loadTopics().catch(() => {
      setErrorMessage("Unable to load support topic options.");
      setIsLoadingTopics(false);
    });
  }, [isLoadingTopics, open, topics.length]);

  const updateField =
    (field: keyof ContactFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((previousState) => ({
        ...previousState,
        [field]: event.target.value,
      }));
      setErrorMessage(null);
      setSuccessMessage(null);
    };

  const updateTopic = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((previousState) => ({
      ...previousState,
      topic: event.target.value,
    }));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const closeDialog = (nextOpenState: boolean) => {
    setOpen(nextOpenState);
    if (!nextOpenState) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.firstName.trim()) {
      setErrorMessage("Please provide your first name.");
      return;
    }

    if (!formState.lastName.trim()) {
      setErrorMessage("Please provide your last name.");
      return;
    }

    if (!isValidEmailFormat(formState.email.trim())) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!formState.topic.trim()) {
      setErrorMessage("Please select a topic.");
      return;
    }

    if (!formState.title.trim()) {
      setErrorMessage("Please provide a title.");
      return;
    }

    if (!formState.message.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/helpdesk/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formState.firstName.trim(),
          lastName: formState.lastName.trim(),
          email: formState.email.trim(),
          topic: formState.topic,
          title: formState.title.trim(),
          message: formState.message.trim(),
        }),
      });

      const responseBody = (await response.json()) as {
        error?: string;
        ticketId?: number;
      };

      if (!response.ok) {
        throw new Error(
          responseBody.error ||
            "Your request could not be submitted. Please try again."
        );
      }

      setSuccessMessage("Your request has been submitted successfully.");

      setFormState((previousState) => ({
        ...INITIAL_FORM_STATE,
        topic: previousState.topic,
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your request could not be submitted. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AppButton
        text="Get in touch"
        type="primary"
        className="self-start"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
      />

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Send your inquiry to the right team by selecting a topic.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-title">
                First Name
              </label>
              <Input
                id="firstName"
                value={formState.firstName}
                onChange={updateField("firstName")}
                placeholder="Your first name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-title">
                Last Name
              </label>
              <Input
                id="lastName"
                value={formState.lastName}
                onChange={updateField("lastName")}
                placeholder="Your last name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-title">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={updateField("email")}
                placeholder="you@example.org"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="topic" className="text-sm font-title">
                Topic
              </label>
              <select
                id="topic"
                value={formState.topic}
                onChange={updateTopic}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingTopics || !isTopicAvailable}
                required
              >
                {!isTopicAvailable && (
                  <option value="">
                    {isLoadingTopics
                      ? "Loading topics..."
                      : "No topics available"}
                  </option>
                )}
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-title">
                Title
              </label>
              <Input
                id="title"
                value={formState.title}
                onChange={updateField("title")}
                placeholder="A short title"
                maxLength={160}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-title">
                Message
              </label>
              <textarea
                id="message"
                value={formState.message}
                onChange={updateField("message")}
                placeholder="Describe your request"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground min-h-[140px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={4000}
                required
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-700" role="alert">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-sm text-green-700" role="status">
                {successMessage}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <DialogButton
                type="button"
                variant="outline"
                onClick={() => closeDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </DialogButton>
              <DialogButton
                type="submit"
                disabled={isSubmitting || !isTopicAvailable}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </DialogButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
