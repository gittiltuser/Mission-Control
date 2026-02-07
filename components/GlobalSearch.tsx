"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, FileText, Brain, CheckSquare, X, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { format } from "date-fns";

interface SearchResult {
  _id: string;
  resultType: string;
  title?: string;
  content?: string;
  updatedAt?: number;
  tags?: string[];
  path?: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["memory", "document", "task"]);
  
  const results = useQuery(
    api.search?.global,
    query.length > 2 ? { query, limit: 20, types: selectedTypes } : "skip"
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const isLoading = results === undefined && query.length > 2;
  const resultList: SearchResult[] = results || [];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-blue-500" />
          Global Search
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search memories, documents, tasks..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <FilterChip label="Memories" icon={Brain} active={selectedTypes.includes("memory")} onClick={() => toggleType("memory")} color="purple" />
          <FilterChip label="Documents" icon={FileText} active={selectedTypes.includes("document")} onClick={() => toggleType("document")} color="blue" />
          <FilterChip label="Tasks" icon={CheckSquare} active={selectedTypes.includes("task")} onClick={() => toggleType("task")} color="green" />
        </div>
      </div>
      <div className="p-4">
        {query.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Start typing to search across everything</p>
            <p className="text-sm mt-2">Searches memories, documents, and tasks</p>
          </div>
        ) : query.length < 3 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Type at least 3 characters...</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12 text-gray-500">Searching...</div>
        ) : resultList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No results found for "{query}"</p>
            <p className="text-sm mt-2">Try different keywords or check your filters</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 mb-3">{resultList.length} results found</p>
            {resultList.map((result: SearchResult) => (
              <SearchResultCard key={result._id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, icon: Icon, active, onClick, color }: { label: string; icon: LucideIcon; active: boolean; onClick: () => void; color: string }) {
  const colors: Record<string, string> = {
    purple: active ? "bg-purple-500 text-white" : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20",
    blue: active ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
    green: active ? "bg-green-500 text-white" : "bg-green-500/10 text-green-400 hover:bg-green-500/20",
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${colors[color]}`}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const type = result.resultType;
  return (
    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${type === "memory" ? "bg-purple-500/10 text-purple-400" : type === "document" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}>
          {type === "memory" && <Brain className="w-4 h-4" />}
          {type === "document" && <FileText className="w-4 h-4" />}
          {type === "task" && <CheckSquare className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white truncate">{result.title || result.content?.slice(0, 50) || "Untitled"}</h3>
            <span className={`text-xs px-1.5 py-0.5 rounded ${type === "memory" ? "bg-purple-500/20 text-purple-300" : type === "document" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"}`}>{type}</span>
          </div>
          {result.content && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{result.content.slice(0, 150)}{result.content.length > 150 && "..."}</p>}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {result.updatedAt && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(result.updatedAt, "MMM d, yyyy")}</span>}
            {result.tags && result.tags.length > 0 && <span>{result.tags.join(", ")}</span>}
            {result.path && <span className="truncate max-w-xs">{result.path}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
