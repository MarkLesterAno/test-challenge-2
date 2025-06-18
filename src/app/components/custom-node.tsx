import { DecoratorNode, SerializedLexicalNode, $applyNodeReplacement, LexicalNode } from 'lexical'
import * as React from 'react'

interface SerializedFootnoteNode extends SerializedLexicalNode {
  footnoteText: string
}

export class FootnoteNode extends DecoratorNode<React.JSX.Element> {
  __footnoteText: string

  static getType(): string {
    return 'footnote'
  }

  static clone(node: FootnoteNode): FootnoteNode {
    return new FootnoteNode(node.__footnoteText, node.__key)
  }

  constructor(footnoteText: string, key?: string) {
    super(key)
    this.__footnoteText = footnoteText
  }

  getFootnoteText(): string {
    return this.__footnoteText
  }

  setFootnoteText(text: string): void {
    const writable = this.getWritable()
    writable.__footnoteText = text
  }

  exportJSON(): SerializedFootnoteNode {
    return {
      ...super.exportJSON(),
      type: 'footnote',
      version: 1,
      footnoteText: this.getFootnoteText(),
    }
  }

  static importJSON(serializedNode: SerializedFootnoteNode): FootnoteNode {
    const { footnoteText } = serializedNode
    return new FootnoteNode(footnoteText)
  }

  createDOM(): HTMLElement {
    return document.createElement('span')
  }

  updateDOM(): boolean {
    return false
  }

  decorate(): React.JSX.Element {
    return <sup>{this.__footnoteText}</sup>
  }
} // Helper to create a new footnote node
export function $createFootnoteNode(text = 'footnote'): FootnoteNode {
  return $applyNodeReplacement(new FootnoteNode(text))
}

// Type guard (fixed to avoid undefined reference)
export function $isFootnoteNode(node: LexicalNode | null | undefined): node is FootnoteNode {
  return node instanceof FootnoteNode
}
