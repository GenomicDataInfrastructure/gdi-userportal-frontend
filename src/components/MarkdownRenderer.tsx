/* SPDX-FileCopyrightText: 2025 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        h1: ({ ...props }) => (
          <h1
            className="text-left font-title text-2xl sm:text-3xl mb-6 decoration-primary"
            {...props}
          />
        ),
        h2: ({ ...props }) => (
          <h2
            className="text-left font-title text-xl sm:text-2xl mb-4 mt-6"
            {...props}
          />
        ),
        h3: ({ ...props }) => (
          <h3
            className="text-left font-title text-lg sm:text-xl mb-4 mt-4"
            {...props}
          />
        ),
        p: ({ ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
        ul: ({ ...props }) => (
          <ul className="list-disc mb-6 ml-6" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal mb-6 ml-6" {...props} />
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
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
