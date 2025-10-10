"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Building2, Star, Users, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface CompanySuggestion {
  name: string;
  industry: string;
  country: string;
  rating: number;
  reviewCount: number;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onCompanySelect?: (companyName: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  onCompanySelect,
  placeholder = "Search companies or industries..." 
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update input position for portal positioning
  const updateInputPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputPosition({
        top: rect.bottom + window.scrollY + 12,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    setLoading(true);
    updateInputPosition(); // Update position before showing suggestions
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=6`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.length >= 2) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200); // Reduced from 300ms to 200ms for faster response

    return () => clearTimeout(timeoutId);
  }, [value, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSearch(value);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selectedSuggestion = suggestions[selectedIndex];
          onChange(selectedSuggestion.name);
          onSearch(selectedSuggestion.name);
          setShowSuggestions(false);
        } else {
          onSearch(value);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: CompanySuggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    inputRef.current?.focus();
    
    // If onCompanySelect is provided, use it for direct navigation
    if (onCompanySelect) {
      onCompanySelect(suggestion.name);
    } else {
      // Fallback to regular search
      onSearch(suggestion.name);
    }
  };


  // Update position on scroll and resize
  useEffect(() => {
    const handleScroll = () => {
      if (showSuggestions) {
        updateInputPosition();
      }
    };

    const handleResize = () => {
      if (showSuggestions) {
        updateInputPosition();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [showSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="h-16 pl-8 pr-20 text-lg bg-background/95 backdrop-blur-sm text-foreground border-2 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 rounded-2xl shadow-xl transition-all duration-200"
        />
        <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground pointer-events-none" />
        
        {showSuggestions && (suggestions.length > 0 || loading) && createPortal(
          <Card 
            ref={suggestionsRef}
            className="fixed z-[99999] max-h-80 overflow-y-auto shadow-2xl border-2 border-primary/10 bg-background/95 backdrop-blur-md rounded-2xl"
            style={{
              top: inputPosition.top,
              left: inputPosition.left,
              width: inputPosition.width
            }}
          >
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.name}
                      className={`px-6 py-4 cursor-pointer hover:bg-primary/5 transition-all duration-200 border-b border-primary/5 last:border-b-0 ${
                        index === selectedIndex ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{suggestion.name}</div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{suggestion.industry}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Globe className="h-3 w-3" />
                                <span>{suggestion.country}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{suggestion.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {suggestion.reviewCount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No companies found
                </div>
              )}
            </CardContent>
          </Card>,
          document.body
        )}
      </div>
    </div>
  );
}
