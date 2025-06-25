
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { Panchayath } from "@/types/admin";

interface PanchayathSearchFilterProps {
  panchayaths: Panchayath[];
  selectedPanchayath: string;
  onPanchayathChange: (value: string) => void;
  filterCategory: string;
  filterStatus: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  className?: string;
}

const PanchayathSearchFilter = ({
  panchayaths,
  selectedPanchayath,
  onPanchayathChange,
  filterCategory,
  filterStatus,
  onCategoryChange,
  onStatusChange,
  className = ""
}: PanchayathSearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPanchayaths = panchayaths.filter(p => 
    p.malayalamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Search Panchayath
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search panchayath..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Panchayath</Label>
          <Select value={selectedPanchayath} onValueChange={onPanchayathChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Panchayaths" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              <SelectItem value="all">All Panchayaths</SelectItem>
              {filteredPanchayaths.map((panchayath) => (
                <SelectItem key={panchayath.id} value={panchayath.malayalamName}>
                  <div className="flex flex-col">
                    <span className="font-medium">{panchayath.malayalamName}</span>
                    <span className="text-xs text-gray-500">{panchayath.englishName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category Filter</Label>
          <Select value={filterCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="pennyekart-free">Pennyekart Free</SelectItem>
              <SelectItem value="pennyekart-paid">Pennyekart Paid</SelectItem>
              <SelectItem value="farmelife">FarmeLife</SelectItem>
              <SelectItem value="foodelife">FoodeLife</SelectItem>
              <SelectItem value="organelife">OrganeLife</SelectItem>
              <SelectItem value="entrelife">EntreLife</SelectItem>
              <SelectItem value="job-card">Job Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status Filter</Label>
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PanchayathSearchFilter;
