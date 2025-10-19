import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  operatorFilter?: string;
  onOperatorChange?: (value: string) => void;
  amountFilter?: string;
  onAmountChange?: (value: string) => void;
  dateFilter?: string;
  onDateChange?: (value: string) => void;
  onReset: () => void;
  searchPlaceholder: string;
  showOperator?: boolean;
  showAmount?: boolean;
  showDate?: boolean;
  operators?: string[];
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  operatorFilter,
  onOperatorChange,
  amountFilter,
  onAmountChange,
  dateFilter,
  onDateChange,
  onReset,
  searchPlaceholder,
  showOperator = false,
  showAmount = false,
  showDate = false,
  operators = [],
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="ACCEPTED">مقبول</SelectItem>
            <SelectItem value="PENDING">معلق</SelectItem>
            <SelectItem value="REFUSED">مرفوض</SelectItem>
            <SelectItem value="BLOCKED">محظور</SelectItem>
            <SelectItem value="ACCEPT">نشط</SelectItem>
          </SelectContent>
        </Select>

        {showOperator && operators.length > 0 && (
          <Select value={operatorFilter} onValueChange={onOperatorChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="المشغل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المشغلين</SelectItem>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>{op}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {showAmount && (
          <Select value={amountFilter} onValueChange={onAmountChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="المبلغ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المبالغ</SelectItem>
              <SelectItem value="0-10">0 - 10 درهم</SelectItem>
              <SelectItem value="10-30">10 - 30 درهم</SelectItem>
              <SelectItem value="30-50">30 - 50 درهم</SelectItem>
              <SelectItem value="50+">50+ درهم</SelectItem>
            </SelectContent>
          </Select>
        )}

        {showDate && (
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="التاريخ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التواريخ</SelectItem>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Button variant="outline" onClick={onReset} className="gap-2">
          <X className="h-4 w-4" />
          إعادة تعيين
        </Button>
      </div>
    </div>
  );
}
