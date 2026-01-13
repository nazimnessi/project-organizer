import * as React from "react";
import { X, Check, ChevronsUpDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TagSelectProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  availableTags: string[];
  placeholder?: string;
}

export function TagSelect({
  selected,
  onChange,
  availableTags,
  placeholder = "Select tags...",
}: TagSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (tag: string) => {
    onChange(selected.filter((s) => s !== tag));
  };

  const handleSelect = (tag: string) => {
    setInputValue("");
    if (selected.includes(tag)) {
      onChange(selected.filter((s) => s !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const createTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !availableTags.includes(newTag) && !selected.includes(newTag)) {
      onChange([...selected, newTag]);
    }
    setInputValue("");
  };

  const filteredTags = availableTags.filter(
    (tag) => !selected.includes(tag)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 px-3 py-2 bg-background/50 hover:bg-background/80 transition-colors"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(tag);
                  }}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search or create tag..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue) {
                createTag();
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col gap-2 p-2">
                <p className="text-xs text-muted-foreground">No tags found.</p>
                {inputValue && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="justify-start gap-2 h-8"
                    onClick={createTag}
                  >
                    <Plus className="h-3 w-3" />
                    Create "{inputValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag}
                  onSelect={() => handleSelect(tag)}
                  className="flex items-center justify-between"
                >
                  {tag}
                  {selected.includes(tag) && <Check className="h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
