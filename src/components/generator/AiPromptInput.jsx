import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2 } from "lucide-react";

/**
 * @typedef {{
 *   onGenerate: (prompt: string) => void,
 *   isLoading: boolean
 * }} AiPromptInputProps
 */

/** @param {AiPromptInputProps} props */
export default function AiPromptInput({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt.trim());
  };

  /** @param {React.KeyboardEvent<HTMLTextAreaElement>} e */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={prompt}
        onChange={
          /** @param {React.ChangeEvent<HTMLTextAreaElement>} e */
          (e) => setPrompt(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder='Опишите, что хотите создать... Например: "приложение для трекинга привычек на React с графиками"'
        className="min-h-[80px] pr-14 bg-secondary/30 border-border/40 resize-none text-sm placeholder:text-muted-foreground/60"
      />
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !prompt.trim()}
        size="icon"
        className="absolute bottom-3 right-3 h-9 w-9 bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
