export type BlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "link"
  | "quote"
  | "divider"
  | "list"
  | "callout"
  | "embed"
  | "wrong_right";

export type WrongRightCategory = "gramatica" | "postura" | "mensagem" | "atitude";

export type WrongRightLevel = "iniciante" | "intermediario" | "avancado";

export interface BaseBlock<TType extends BlockType, TData> {
  id: string;
  type: TType;
  data: TData;
}

export type HeadingBlock = BaseBlock<
  "heading",
  {
    level: 1 | 2 | 3;
    text: string;
  }
>;

export type ParagraphBlock = BaseBlock<
  "paragraph",
  {
    text: string;
  }
>;

export type ImageBlock = BaseBlock<
  "image",
  {
    url: string;
    caption?: string;
  }
>;

export type LinkBlock = BaseBlock<
  "link",
  {
    label: string;
    href: string;
  }
>;

export type QuoteBlock = BaseBlock<
  "quote",
  {
    text: string;
    attribution?: string;
  }
>;

export type DividerBlock = BaseBlock<"divider", Record<string, never>>;

export type ListBlock = BaseBlock<
  "list",
  {
    style: "bullet" | "numbered";
    items: string[];
  }
>;

export type CalloutBlock = BaseBlock<
  "callout",
  {
    tone: "info" | "alert" | "tip";
    text: string;
  }
>;

export type EmbedBlock = BaseBlock<
  "embed",
  {
    url: string;
    title?: string;
  }
>;

export interface WrongRightPair {
  wrong: string;
  right: string;
  category: WrongRightCategory;
  level: WrongRightLevel;
  explanation?: string;
}

export type WrongRightBlock = BaseBlock<
  "wrong_right",
  {
    title?: string;
    pairs: WrongRightPair[];
  }
>;

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | LinkBlock
  | QuoteBlock
  | DividerBlock
  | ListBlock
  | CalloutBlock
  | EmbedBlock
  | WrongRightBlock;

export interface PageContent {
  blocks: Block[];
}

