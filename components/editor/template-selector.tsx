"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Plus, Search } from "lucide-react";
import { TemplateManager, type LanguageTemplate } from "@/lib/templates";

interface TemplateSelectorProps {
  onCreateFile: (name: string, content: string) => void;
  trigger?: React.ReactNode;
}

export function TemplateSelector({
  onCreateFile,
  trigger,
}: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<LanguageTemplate | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = TemplateManager.getAvailableCategories();
  const allTemplates = TemplateManager.getTemplatesByCategory();

  const filteredTemplates = allTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: LanguageTemplate) => {
    setSelectedTemplate(template);
    setFileName(`new-file.${template.extension}`);
  };

  const handleCreateFile = () => {
    if (selectedTemplate && fileName) {
      onCreateFile(fileName, selectedTemplate.content);
      setOpen(false);
      setSelectedTemplate(null);
      setFileName("");
      setSearchQuery("");
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="h-4 w-4 mr-2" />
      New from Template
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Create File from Template</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[60vh]">
          {/* Template Selection */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-3">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.name}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedTemplate?.name === template.name
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{template.icon}</span>

                              <div>
                                <h3 className="font-medium">{template.name}</h3>

                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {template.language}
                              </Badge>

                              <Badge variant="outline" className="text-xs">
                                .{template.extension}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {categories.map((category) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <ScrollArea className="h-[400px]">
                      <div className="grid gap-3">
                        {TemplateManager.getTemplatesByCategory(category)
                          .filter(
                            (template) =>
                              template.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              template.description
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                          )
                          .map((template) => (
                            <div
                              key={template.name}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                                selectedTemplate?.name === template.name
                                  ? "border-primary bg-primary/5"
                                  : ""
                              }`}
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">
                                    {template.icon}
                                  </span>

                                  <div>
                                    <h3 className="font-medium">
                                      {template.name}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mt-1">
                                      {template.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {template.language}
                                  </Badge>

                                  <Badge variant="outline" className="text-xs">
                                    .{template.extension}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Preview & Create */}
          <div className="border-l pl-6">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    <span className="text-xl">{selectedTemplate.icon}</span>

                    {selectedTemplate.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTemplate.description}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {selectedTemplate.language}
                    </Badge>

                    <Badge variant="outline">{selectedTemplate.category}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>

                  <Input
                    id="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder={`new-file.${selectedTemplate.extension}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>

                  <ScrollArea className="h-[200px] border rounded-md p-3">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {selectedTemplate.content.slice(0, 500)}
                      {selectedTemplate.content.length > 500 && "..."}
                    </pre>
                  </ScrollArea>
                </div>

                <Button
                  onClick={handleCreateFile}
                  className="w-full"
                  disabled={!fileName}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create File
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <div>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />

                  <p>Select a template to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
