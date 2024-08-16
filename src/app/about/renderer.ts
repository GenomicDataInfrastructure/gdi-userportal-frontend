import { Renderer, marked } from "marked";

const renderer = new Renderer();

type ContentType =
  | string
  | number
  | boolean
  | null
  | undefined
  | ContentObject
  | ContentType[];

interface ContentObject {
  type?: string;
  text?: string;
  items?: ContentType[];
  [key: string]: ContentType | undefined;
}

const stringifyContent = (content: ContentType): string => {
  if (typeof content === "object" && content !== null) {
    if (Array.isArray(content)) {
      return content.map(stringifyContent).join("");
    }
    if ("type" in content) {
      if (content.type === "text") {
        return content.text || "";
      }
      if (content.type === "list" && content.items) {
        return content.items
          .map((item) => `<li>${stringifyContent(item)}</li>`)
          .join("");
      }
    }
    return content.text || JSON.stringify(content);
  }
  return String(content);
};

renderer.heading = (text: string, level: number) => {
  const className =
    level === 1
      ? "text-left font-medium text-2xl sm:text-3xl mb-4"
      : "text-lg font-medium sm:text-xl my-4";
  return `<h${level} class="${className}">${stringifyContent(text)}</h${level}>`;
};

renderer.paragraph = (text: string) => {
  const parsedText = marked.parseInline(stringifyContent(text));
  return `<p class="mb-4">${parsedText}</p>`;
};

renderer.list = (body: string, ordered: boolean) => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="list-inside list-disc mb-4">${stringifyContent(body)}</${tag}>`;
};

renderer.listitem = (text: string) => {
  return `<li class="mb-2">${marked.parseInline(stringifyContent(text))}</li>`;
};

renderer.link = (href: string, title: string | null, text: string) => {
  return `<a href="${href}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
};

export default renderer;
