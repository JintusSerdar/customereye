import React, { useState } from 'react';

interface ReportSearchProps {
  types: string[];
  companies: string[];
  search: string;
  selectedType: string;
  selectedCompany: string;
  sort: string;
  onFilterChange: (filters: { search: string; type: string; company: string; sort: string }) => void;
}

export const ReportSearch: React.FC<ReportSearchProps> = ({ types, companies, search, selectedType, selectedCompany, sort, onFilterChange }) => {
  const [companyInput, setCompanyInput] = useState('');
  const filteredCompanies = companies.filter(c => c.toLowerCase().includes(companyInput.toLowerCase()));

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 w-full">
      {/* Search Bar */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search reports..."
          className="input input-bordered w-full"
          value={search}
          onChange={e => onFilterChange({ search: e.target.value, type: selectedType, company: selectedCompany, sort })}
        />
      </div>
      {/* Type Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-full border ${selectedType === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          onClick={() => onFilterChange({ search, type: '', company: selectedCompany, sort })}
        >
          All Types
        </button>
        {types.map(type => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full border ${selectedType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => onFilterChange({ search, type, company: selectedCompany, sort })}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Company Autocomplete */}
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          placeholder="Filter by company..."
          className="input input-bordered w-full"
          value={companyInput}
          onChange={e => setCompanyInput(e.target.value)}
          onFocus={() => setCompanyInput('')}
        />
        {companyInput && (
          <div className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto shadow">
            {filteredCompanies.length === 0 && <div className="p-2 text-gray-400">No companies</div>}
            {filteredCompanies.map(company => (
              <div
                key={company}
                className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedCompany === company ? 'bg-blue-200' : ''}`}
                onClick={() => {
                  onFilterChange({ search, type: selectedType, company, sort });
                  setCompanyInput('');
                }}
              >
                {company}
              </div>
            ))}
          </div>
        )}
        {selectedCompany && !companyInput && (
          <div className="mt-1 text-xs text-blue-600 flex items-center gap-2">
            <span>Filtered: {selectedCompany}</span>
            <button className="ml-2 text-red-500" onClick={() => onFilterChange({ search, type: selectedType, company: '', sort })}>×</button>
          </div>
        )}
      </div>
      {/* Sorting Dropdown */}
      <div>
        <select
          className="select select-bordered"
          value={sort}
          onChange={e => onFilterChange({ search, type: selectedType, company: selectedCompany, sort: e.target.value })}
        >
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
          <option value="type">By Type</option>
        </select>
      </div>
    </div>
  );
}; 