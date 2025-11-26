import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  List,
  Image,
  Link,
  Type,
  ChevronDown,
  ChevronRight,
  Circle,
  X,
  Edit,
} from "lucide-react";
import { useSetTopbar } from "@/api/hooks/TopbarContext";
import { useCreateJournal, useGetJournals, useDeleteJournal, useUpdateJournal } from "../../../api/hooks/Journal/useJournal";
import { toast } from "sonner";

// Types
interface ToolbarButton {
  icon: React.ComponentType<any>;
  label: string;
  isDropdown?: boolean;
  action?: () => void;
}

interface ApiJournal {
  id: number | string;
  title: string;
  body?: string;
  description?: string;
  tickers?: string[];
  created_at?: string;
  createdAt?: string;
  date?: string;
  time?: string;
}

const AddNewJournal: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [fontSize, setFontSize] = useState<string>("14");
  const [showFontSizeDropdown, setShowFontSizeDropdown] =
    useState<boolean>(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createJournal = useCreateJournal();

  const formatText = useCallback(
    (command: string, value: string | null = null): void => {
      if (typeof document !== "undefined") {
        document.execCommand(command, false, value as any);
        editorRef.current?.focus();
      }
    },
    []
  );

  const handleAlignment = useCallback(
    (alignment: "left" | "center" | "right"): void => {
      const command =
        alignment === "left"
          ? "justifyLeft"
          : alignment === "center"
            ? "justifyCenter"
            : "justifyRight";
      formatText(command);
    },
    [formatText]
  );

  const handleImageUpload = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            formatText("insertImage", e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
      event.target.value = "";
    },
    [formatText]
  );

  const getContent = useCallback((): string => {
    return editorRef.current?.innerHTML || "";
  }, []);

  const handleList = useCallback((): void => {
    formatText("insertUnorderedList");
  }, [formatText]);

  const handleQuote = useCallback((): void => {
    formatText("formatBlock", "blockquote");
  }, [formatText]);

  const handleLink = useCallback((): void => {
    const url =
      typeof window !== "undefined"
        ? window.prompt("Enter the URL:")
        : null;
    if (url) {
      formatText("createLink", url);
    }
  }, [formatText]);

  const applyFontSize = useCallback(
    (size: string): void => {
      if (typeof window === "undefined") return;

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (range.collapsed) {
          if (editorRef.current) {
            editorRef.current.style.fontSize = `${size}px`;
          }
        } else {
          const span = document.createElement("span");
          span.style.fontSize = `${size}px`;
          try {
            range.surroundContents(span);
          } catch {
            document.execCommand("fontSize", false, "3");
            const fontElements =
              editorRef.current?.getElementsByTagName("font");
            if (fontElements) {
              Array.from(fontElements).forEach((el) => {
                if (el.size === "3") {
                  el.removeAttribute("size");
                  el.style.fontSize = `${size}px`;
                }
              });
            }
          }
        }
      } else if (editorRef.current) {
        editorRef.current.style.fontSize = `${size}px`;
      }

      editorRef.current?.focus();
    },
    []
  );

  const getWordCount = useCallback((): number => {
    const text = editorRef.current?.innerText || "";
    return text.split(/\s+/).filter((w) => w.length > 0).length;
  }, []);

  const fontSizeOptions: string[] = [
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
  ];

  const handleFontSizeChange = useCallback(
    (size: string): void => {
      setFontSize(size);
      applyFontSize(size);
      setShowFontSizeDropdown(false);
    },
    [applyFontSize]
  );

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: Type,
      label: "Font Size",
      isDropdown: true,
      action: () => setShowFontSizeDropdown((prev) => !prev),
    },
    { icon: Type, label: "Type", action: () => { } },
    { icon: Circle, label: "Circle", action: () => { } },
    { icon: Bold, label: "Bold", action: () => formatText("bold") },
    { icon: Italic, label: "Italic", action: () => formatText("italic") },
    {
      icon: Underline,
      label: "Underline",
      action: () => formatText("underline"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => formatText("strikeThrough"),
    },
    {
      icon: AlignLeft,
      label: "Align Left",
      action: () => handleAlignment("left"),
    },
    {
      icon: AlignCenter,
      label: "Align Center",
      action: () => handleAlignment("center"),
    },
    {
      icon: AlignRight,
      label: "Align Right",
      action: () => handleAlignment("right"),
    },
    { icon: Quote, label: "Quote", action: () => handleQuote() },
    { icon: List, label: "List", action: () => handleList() },
    { icon: Image, label: "Image", action: () => handleImageUpload() },
    { icon: Link, label: "Link", action: () => handleLink() },
  ];

  const handleSubmit = useCallback((): void => {
    const htmlContent = getContent();
    const cleanTitle = title.trim();
    const cleanContent = htmlContent.trim();

    if (!cleanTitle && !cleanContent) {
      toast.error("Please add a title or some content before saving.");
      return;
    }

    const payload = {
      content_type: "threadpost",
      tickers: [],
      title: cleanTitle,
      body: htmlContent,
      assets: [],
    };

    createJournal.mutate(payload, {
      onSuccess: () => {
        toast.success("Journal Created!");
        setTitle("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          editorRef.current.style.fontSize = `${fontSize}px`;
          editorRef.current.setAttribute(
            "data-placeholder",
            "Write here your thinking..."
          );
        }
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Failed to create journal");
      },
    });
  }, [title, getContent, createJournal, fontSize]);

  useEffect(() => {
    if (!showFontSizeDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".font-size-dropdown-trigger")) {
        setShowFontSizeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showFontSizeDropdown]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Title</label>
        <input
          type="text"
          placeholder="Enter title of journal"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          className="w-full !rounded-lg border px-4 py-3 outline-none glass text-white placeholder:text-gray-500"
          style={{ background: "rgba(20, 20, 20, 0.30)" }}
        />
      </div>

      {/* Editor */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Take a note
        </label>
        <div
          className="border rounded-xl overflow-hidden glass"
          style={{ background: "rgba(20, 20, 20, 0.30)" }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-end gap-1 px-4 py-2 border-b border-white/10 flex-wrap">
            {/* Font Size Dropdown */}
            <div className="relative font-size-dropdown-trigger">
              <button
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-all"
                onClick={() =>
                  setShowFontSizeDropdown((prev) => !prev)
                }
                type="button"
              >
                <span className="text-white text-sm">{fontSize}</span>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>
              {showFontSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-20">
                  {fontSizeOptions.map((size) => (
                    <button
                      key={size}
                      className={`w-full px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors text-left ${size === fontSize ? "bg-gray-700" : ""
                        }`}
                      onClick={() => handleFontSizeChange(size)}
                      type="button"
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Toolbar Buttons */}
            {toolbarButtons.map((btn, index) => {
              if (btn.isDropdown) return null;
              const Icon = btn.icon;
              return (
                <React.Fragment key={btn.label}>
                  <button
                    className="p-2 rounded hover:bg-white/10 transition-all"
                    title={btn.label}
                    onClick={btn.action}
                    type="button"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </button>
                  {(index === 3 || index === 7 || index === 9) && (
                    <div className="w-px h-6 bg-white/10 mx-1" />
                  )}
                </React.Fragment>
              );
            })}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* ContentEditable */}
          <div className="relative">
            <div
              ref={editorRef}
              contentEditable
              className="w-full min-h-[300px] p-4 outline-none bg-transparent text-white placeholder:text-gray-500 resize-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: "1.6",
              }}
              data-placeholder="Write here your thinking..."
              onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
                e.preventDefault();
                const text =
                  e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              onKeyDown={(
                e: React.KeyboardEvent<HTMLDivElement>
              ) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onInput={() => {
                const el = editorRef.current;
                if (!el) return;
                if ((el.textContent || "").trim().length === 0) {
                  el.setAttribute(
                    "data-placeholder",
                    "Write here your thinking..."
                  );
                } else {
                  el.removeAttribute("data-placeholder");
                }
              }}
            />
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
              {getWordCount()} / 3000 words
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          className="special-btn !px-6 !py-5 font-medium flex items-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, #14E893 0%, #5131AD 100%)",
            borderRadius: "9999px",
          }}
          onClick={handleSubmit}
          type="button"
          disabled={createJournal.isPending}
        >
          {createJournal.isPending ? "Saving..." : "Add new"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const PreviousJournals: React.FC = () => {
  const { data, isLoading, isError } = useGetJournals({
    start_date: "2024-01-01",
    end_date: "2030-01-01",
    limit: 20,
    offset: 0,
  });

  const deleteJournal = useDeleteJournal();
  const updateJournal = useUpdateJournal();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [editingJournal, setEditingJournal] = useState<ApiJournal | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");

  const goToAddNew = () => {
    if (typeof document === "undefined") return;
    const addTrigger = document.querySelector<HTMLButtonElement>(
      'button[value="add-new"]'
    );
    addTrigger?.click();
  };

  const handleDeleteJournal = useCallback((journalId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();

    // Direct delete without browser alert
    setIsDeleting(true);
    deleteJournal.mutate(String(journalId), {
      onSuccess: () => {
        toast.success("Journal deleted successfully!");
        closePopup();
        setIsDeleting(false);
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Failed to delete journal");
        setIsDeleting(false);
      },
    });
  }, [deleteJournal]);

  const handleEditJournal = useCallback((journal: ApiJournal, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingJournal(journal);
    setEditTitle(journal.title);
    setEditContent(journal.body || journal.description || "");
  }, []);

  const handleUpdateJournal = useCallback(() => {
    if (!editingJournal) return;

    const cleanTitle = editTitle.trim();
    const cleanContent = editContent.trim();

    if (!cleanTitle && !cleanContent) {
      toast.error("Please add a title or some content before updating.");
      return;
    }

    const payload = {
      title: cleanTitle,
      body: cleanContent,
      tickers: editingJournal.tickers || [],
    };

    updateJournal.mutate({
      contentId: String(editingJournal.id),
      data: payload
    }, {
      onSuccess: () => {
        toast.success("Journal updated successfully!");
        setEditingJournal(null);
        setEditTitle("");
        setEditContent("");
        closePopup();
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Failed to update journal");
      },
    });
  }, [editingJournal, editTitle, editContent, updateJournal]);

  const cancelEdit = useCallback(() => {
    setEditingJournal(null);
    setEditTitle("");
    setEditContent("");
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between mb-8">
        <div />
        <p className="text-white">Loading journals...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between mb-8">
        <p className="text-red-400">
          Failed to load journals. Please try again.
        </p>
        <Button
          onClick={goToAddNew}
          className="special-btn !px-6 !py-4 font-medium flex items-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, #14E893 0%, #5131AD 100%)",
            borderRadius: "9999px",
          }}
        >
          Add new
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const journals: ApiJournal[] = data?.data || [];

  if (!journals.length) {
    return (
      <div className="flex items-center justify-between mb-8">
        <p className="text-gray-400">No journals found yet.</p>
        <Button
          onClick={goToAddNew}
          className="special-btn !px-6 !py-2 font-medium flex items-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, #14E893 0%, #5131AD 100%)",
            borderRadius: "9999px",
          }}
        >
          Add new
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  const openPopup = (index: number) => setSelectedIndex(index);
  const closePopup = () => {
    setSelectedIndex(null);
    setEditingJournal(null);
    setEditTitle("");
    setEditContent("");
  };
  const nextEntry = () => {
    if (selectedIndex === null) return;
    const next = (selectedIndex + 1) % journals.length;
    setSelectedIndex(next);
    setEditingJournal(null);
    setEditTitle("");
    setEditContent("");
  };

  const getDateTime = (journal: ApiJournal) => {
    const createdRaw =
      journal.created_at ||
      journal.createdAt ||
      journal.date ||
      "";

    if (!createdRaw) return { dateStr: "", timeStr: "", relativeTime: "" };

    const d = new Date(createdRaw);
    if (!isNaN(d.getTime())) {
      const dateStr = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const timeStr = d.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      let relativeTime = "";
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
        relativeTime = diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        relativeTime = `${diffInHours}h ago`;
      } else if (diffInDays === 1) {
        relativeTime = "Yesterday";
      } else if (diffInDays < 7) {
        relativeTime = `${diffInDays}d ago`;
      } else {
        relativeTime = dateStr;
      }

      return { dateStr, timeStr, relativeTime };
    }

    return { dateStr: createdRaw, timeStr: "", relativeTime: "" };
  };

  return (
    <>
      <div className="space-y-6">
        {/* Top bar with Add new pill (right) */}
        <div className="flex items-center justify-between mb-4">
          <div />
          <Button
            onClick={goToAddNew}
            className="special-btn !px-6 !py-5 font-medium flex items-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, #14E893 0%, #5131AD 100%)",
              borderRadius: "9999px",
            }}
            type="button"
          >
            Add new
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal, index) => {
            const { dateStr, timeStr } = getDateTime(journal);

            return (
              <div
                key={journal.id}
                className="rounded-3xl px-6 py-6 glass flex flex-col gap-3 cursor-pointer group hover:!bg-white/10 transition-all duration-300"
                onClick={() => openPopup(index)}
                style={{
                  background: 'rgba(20, 20, 20, 0.30)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-4 text-sm">
                  {dateStr && (
                    <div className="flex items-center gap-2 py-1.5">
                      <span className="text-[#14E893] text-xs font-semibold">
                        {dateStr}
                      </span>
                    </div>
                  )}
                  {timeStr && (
                    <div className="flex items-center gap-2 py-1.5">
                      <span className="text-[#14E893] text-xs font-semibold">
                        {timeStr}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-white text-[20px] font-semibold leading-snug">
                  {journal.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: journal.body || journal.description || "",
                    }}
                  />
                </p>

                <button
                  className="mt-2 flex items-center gap-1 text-white text-sm font-medium hover:gap-2 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(index);
                  }}
                >
                  <span>Read more</span>
                  <ChevronRight className="w-4 h-4 group-hover:ml-2 transition-all duration-300" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup */}
      {selectedIndex !== null && journals[selectedIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl mx-4 rounded-3xl overflow-hidden bg-[#0A0A0F]/95 border border-white/20 shadow-[0_0_60px_rgba(20,232,147,0.15)]">
            {/* Header with gradient border */}
            <div className="border-b border-white/10 bg-gradient-to-r from-[#14E893]/10 to-[#5131AD]/10">
              <div className="flex items-center justify-between px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#14E893] rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-[#14E893] tracking-wider">
                    JOURNAL ENTRY
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Edit button */}
                  <button
                    className="p-2 cursor-pointer text-gray-400 hover:text-blue-400 transition-all duration-200 hover:bg-blue-400/10 rounded-lg group"
                    onClick={(e) => handleEditJournal(journals[selectedIndex], e)}
                    title="Edit journal"
                  >
                    <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Delete button */}
                  <button
                    className="p-2 cursor-pointer text-gray-400 hover:text-red-400 transition-all duration-200 hover:bg-red-400/10 rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => handleDeleteJournal(journals[selectedIndex].id, e)}
                    title="Delete journal"
                    disabled={isDeleting}
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Close button */}
                  <button
                    className="p-2 cursor-pointer text-gray-400 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-lg group"
                    onClick={closePopup}
                  >
                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 pt-6 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
              {/* Background gradients */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div
                  className="absolute top-0 left-0 w-96 h-96"
                  style={{
                    background: "radial-gradient(circle at top left, #14E893 0%, transparent 50%)",
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-96 h-96"
                  style={{
                    background: "radial-gradient(circle at bottom right, #5131AD 0%, transparent 50%)",
                  }}
                />
              </div>

              {(() => {
                const journal = journals[selectedIndex];
                const { dateStr, timeStr } = getDateTime(journal);
                const srcHtml = journal.body || journal.description || "";

                // If editing this journal
                if (editingJournal?.id === journal.id) {
                  return (
                    <>
                      {/* Date and Time */}
                      <div className="relative flex items-center gap-4 text-sm font-medium">
                        {dateStr && (
                          <div className="flex items-center gap-2 bg-[#14E893]/10 px-3 py-1.5 rounded-full border border-[#14E893]/20">
                            <svg className="w-3 h-3 text-[#14E893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[#14E893] text-xs font-semibold">
                              {dateStr}
                            </span>
                          </div>
                        )}
                        {timeStr && (
                          <div className="flex items-center gap-2 bg-[#5131AD]/10 px-3 py-1.5 rounded-full border border-[#5131AD]/20">
                            <svg className="w-3 h-3 text-[#5131AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[#5131AD] text-xs font-semibold">
                              {timeStr}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Edit Title */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full !rounded-lg border px-4 py-3 outline-none glass text-white placeholder:text-gray-500"
                          style={{ background: "rgba(20, 20, 20, 0.30)" }}
                        />
                      </div>

                      {/* Edit Content */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Content</label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full min-h-[200px] !rounded-lg border px-4 py-3 outline-none glass text-white placeholder:text-gray-500 resize-none"
                          style={{ background: "rgba(20, 20, 20, 0.30)" }}
                        />
                      </div>

                      {/* Edit Actions */}
                      <div className="relative flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                        <Button
                          onClick={cancelEdit}
                          className="!px-6 cursor-pointer !py-3 font-medium border border-gray-600 text-gray-300 hover:text-white"
                          style={{
                            borderRadius: "9999px",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateJournal}
                          className="!px-6 cursor-pointer !py-3 font-medium flex items-center gap-2 group hover:scale-105 transition-transform duration-200"
                          style={{
                            background: "linear-gradient(135deg, #14E893 0%, #5131AD 100%)",
                            borderRadius: "9999px",
                          }}
                          disabled={updateJournal.isPending}
                        >
                          {updateJournal.isPending ? "Updating..." : "Update Journal"}
                        </Button>
                      </div>
                    </>
                  );
                }

                // Normal view (not editing)
                return (
                  <>
                    {/* Date and Time */}
                    <div className="relative flex items-center gap-4 text-sm font-medium">
                      {dateStr && (
                        <div className="flex items-center gap-2 bg-[#14E893]/10 px-3 py-1.5 rounded-full border border-[#14E893]/20">
                          <svg className="w-3 h-3 text-[#14E893]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[#14E893] text-xs font-semibold">
                            {dateStr}
                          </span>
                        </div>
                      )}
                      {timeStr && (
                        <div className="flex items-center gap-2 bg-[#5131AD]/10 px-3 py-1.5 rounded-full border border-[#5131AD]/20">
                          <svg className="w-3 h-3 text-[#5131AD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[#5131AD] text-xs font-semibold">
                            {timeStr}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="relative text-white text-2xl font-bold leading-tight max-w-3xl bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                      {journal.title}
                    </h2>

                    {/* Content */}
                    <div className="relative">
                      <div
                        className="text-gray-300 text-base leading-relaxed prose prose-invert max-w-none
                    prose-headings:text-white prose-strong:text-white prose-em:text-gray-200
                    prose-blockquote:border-l-[#14E893] prose-blockquote:bg-white/5 prose-blockquote:py-1
                    prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#14E893]
                    prose-a:text-[#14E893] prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:border prose-img:border-white/10"
                        dangerouslySetInnerHTML={{
                          __html: srcHtml || "",
                        }}
                      />
                    </div>

                    {/* Footer with navigation */}
                    <div className="relative flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="text-xs text-gray-500">
                        Entry {selectedIndex + 1} of {journals.length}
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={nextEntry}
                          className="!px-6 cursor-pointer !py-5 font-medium flex items-center gap-2 group hover:scale-105 transition-transform duration-200"
                          style={{
                            background: "linear-gradient(135deg, #5131AD 0%, #14E893 100%)",
                            borderRadius: "9999px",
                          }}
                        >
                          Next Entry
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const JournalTabs: React.FC = () => {
  useSetTopbar("journal");

  return (
    <div className="min-h-screen p-8 mt-8 sm:mt-0">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="add-new" className="w-full">
          <TabsList className="flex w-full h-auto p-0 bg-transparent border-b mb-8 rounded-none">
            <div className="flex gap-8 mr-auto">
              <TabsTrigger
                value="add-new"
                className="relative cursor-pointer pb-3 font-normal text-gray-400 hover:text-white !bg-transparent transition-all duration-300 after:absolute after:left-0 after:-bottom-[2px] after:h-[4px] after:w-0 after:transition-all after:duration-300 data-[state=active]:after:w-full after:bg-gradient-to-r after:from-[#14E893] after:to-[#5131AD] after:content-[''] after:rounded-full border-0 data-[state=active]:text-white"
                style={{ fontSize: "20px" }}
              >
                Add new journal
              </TabsTrigger>
              <TabsTrigger
                value="previous"
                className="relative cursor-pointer pb-3 font-normal text-gray-400 hover:text-white !bg-transparent transition-all duration-300 after:absolute after:left-0 after:-bottom-[2px] after:h-[4px] after:w-0 after:transition-all after:duration-300 data-[state=active]:after:w-full after:bg-gradient-to-r after:from-[#14E893] after:to-[#5131AD] after:content-[''] after:rounded-full border-0 data-[state=active]:text-white"
                style={{ fontSize: "20px" }}
              >
                Previous journals
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="add-new">
            <AddNewJournal />
          </TabsContent>
          <TabsContent value="previous">
            <PreviousJournals />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JournalTabs;