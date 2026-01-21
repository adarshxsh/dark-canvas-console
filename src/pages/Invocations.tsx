import { useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { PageHeader, DataTable, StatusBadge } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const invocations = [
  {
    id: "inv-001",
    requestId: "req-abc123",
    function: "process-payment",
    status: "success" as const,
    duration: "124ms",
    memory: "45 MB",
    timestamp: "2024-01-20 14:32:15",
  },
  {
    id: "inv-002",
    requestId: "req-def456",
    function: "send-notification",
    status: "error" as const,
    duration: "30012ms",
    memory: "128 MB",
    timestamp: "2024-01-20 14:31:45",
  },
  {
    id: "inv-003",
    requestId: "req-ghi789",
    function: "resize-image",
    status: "success" as const,
    duration: "456ms",
    memory: "89 MB",
    timestamp: "2024-01-20 14:30:22",
  },
  {
    id: "inv-004",
    requestId: "req-jkl012",
    function: "user-auth",
    status: "success" as const,
    duration: "89ms",
    memory: "32 MB",
    timestamp: "2024-01-20 14:28:11",
  },
  {
    id: "inv-005",
    requestId: "req-mno345",
    function: "data-sync",
    status: "success" as const,
    duration: "1234ms",
    memory: "156 MB",
    timestamp: "2024-01-20 14:25:03",
  },
  {
    id: "inv-006",
    requestId: "req-pqr678",
    function: "process-payment",
    status: "success" as const,
    duration: "118ms",
    memory: "44 MB",
    timestamp: "2024-01-20 14:22:45",
  },
];

export default function Invocations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvocations = invocations.filter((inv) => {
    const matchesSearch =
      inv.function.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.requestId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "requestId",
      header: "Request ID",
      render: (inv: typeof invocations[0]) => (
        <span className="font-mono text-xs text-muted-foreground">{inv.requestId}</span>
      ),
    },
    {
      key: "function",
      header: "Function",
      render: (inv: typeof invocations[0]) => (
        <Link
          to={`/functions/fn-1`}
          className="font-mono text-sm text-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
        >
          {inv.function}
          <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv: typeof invocations[0]) => (
        <StatusBadge status={inv.status === "success" ? "success" : "error"}>
          {inv.status === "success" ? "Success" : "Failed"}
        </StatusBadge>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      className: "text-right",
      render: (inv: typeof invocations[0]) => (
        <span className="text-muted-foreground font-mono text-xs">{inv.duration}</span>
      ),
    },
    {
      key: "memory",
      header: "Memory",
      className: "text-right",
      render: (inv: typeof invocations[0]) => (
        <span className="text-muted-foreground">{inv.memory}</span>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      className: "text-right",
      render: (inv: typeof invocations[0]) => (
        <span className="text-muted-foreground text-xs">{inv.timestamp}</span>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Invocations"
        description="View all function invocations"
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invocations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-background"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invocations Table */}
      <div className="bg-surface border border-border rounded-md">
        <DataTable
          columns={columns}
          data={filteredInvocations}
          emptyMessage="No invocations found"
        />
      </div>
    </AppLayout>
  );
}
