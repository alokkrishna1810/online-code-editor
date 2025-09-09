import React from "react";
import { Command } from "cmdk";

export const CommandPalette = () => {
  const [open, setOpen] = React.useState(false);

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Editor">
          <Command.Item onSelect={() => runCommand(() => alert("Changing theme..."))}>
            Change Theme...
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => alert("Downloading file..."))}>
            Download File
          </Command.Item>
        </Command.Group>

      </Command.List>
    </Command.Dialog>
  );
};