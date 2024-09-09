/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
}

const preprocessMarkdown = (markdown: string): string => {
  return markdown.replace(/<!--.*?-->/gs, "");
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeSanitize]}
      components={{
        h1: ({ ...props }) => (
          <h1
            className="text-left font-medium text-2xl sm:text-3xl mb-6 underline decoration-primary underline-offset-8"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="text-left font-medium text-xl sm:text-2xl mb-4 mt-6"
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            className="text-left font-medium text-lg sm:text-xl mb-4 mt-4"
            {...props}
          />
        ),
        p: ({ ...props }) => (
          <p className="mb-6 font-sans leading-relaxed" {...props} />
        ),
        ul: ({ ...props }) => (
          <ul className="list-inside list-disc mb-6" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-inside list-decimal mb-6" {...props} />
        ),
        li: ({ ...props }) => <li className="mb-3" {...props} />,
        a: ({ ...props }) => (
          <a
            className="text-info hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        table: ({ ...props }) => (
          <table className="table-auto w-full mb-6 rounded-lg" {...props} />
        ),
        thead: ({ ...props }) => <thead className="" {...props} />,
        tbody: ({ ...props }) => <tbody {...props} />,
        tr: ({ ...props }) => <tr {...props} />,
        th: ({ ...props }) => (
          <th
            className="border-2 border-black px-4 py-2 font-bold"
            {...props}
          />
        ),
        td: ({ ...props }) => (
          <td className="border-2 border-black px-4 py-2" {...props} />
        ),
        hr: ({ ...props }) => (
          <hr
            className="my-8 border-primary border-2 w-[40%] mx-auto"
            {...props}
          />
        ),
      }}
    >
      {preprocessMarkdown(content)}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
