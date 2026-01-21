import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical, Play, Trash2, Copy, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { PageHeader, DataTable, StatusBadge, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const functions = [
  {
    id: "fn-1",
    name: "process-payment",
    runtime: "go1.21",
    status: "active" as const,
    lastRun: "2 min ago",
    invocations: 1432,
    avgDuration: "124ms",
  },
  {
    id: "fn-2",
    name: "user-auth",
    runtime: "go1.21",
    status: "active" as const,
    lastRun: "15 min ago",
    invocations: 892,
    avgDuration: "89ms",
  },
  {
    id: "fn-3",
    name: "send-notification",
    runtime: "go1.20",
    status: "error" as const,
    lastRun: "23 min ago",
    invocations: 234,
    avgDuration: "156ms",
  },
  {
    id: "fn-4",
    name: "resize-image",
    runtime: "go1.21",
    status: "active" as const,
    lastRun: "1 hour ago",
    invocations: 567,
    avgDuration: "456ms",
  },
  {
    id: "fn-5",
    name: "data-sync",
    runtime: "go1.21",
    status: "inactive" as const,
    lastRun: "3 days ago",
    invocations: 0,
    avgDuration: "-",
  },
];

export default function Functions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFunctions = functions.filter((fn) =>
    fn.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "error":
        return "Error";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (fn: typeof functions[0]) => (
        <Link
          to={`/functions/${fn.id}`}
          className="font-mono text-sm text-foreground hover:text-primary hover:underline"
        >
          {fn.name}
        </Link>
      ),
    },
    {
      key: "runtime",
      header: "Runtime",
      render: (fn: typeof functions[0]) => (
        <span className="text-muted-foreground font-mono text-xs">{fn.runtime}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (fn: typeof functions[0]) => (
        <StatusBadge
          status={fn.status === "active" ? "success" : fn.status === "error" ? "error" : "inactive"}
        >
          {getStatusLabel(fn.status)}
        </StatusBadge>
      ),
    },
    {
      key: "invocations",
      header: "Invocations",
      className: "text-right",
      render: (fn: typeof functions[0]) => (
        <span className="text-muted-foreground">{fn.invocations.toLocaleString()}</span>
      ),
    },
    {
      key: "avgDuration",
      header: "Avg Duration",
      className: "text-right",
      render: (fn: typeof functions[0]) => (
        <span className="text-muted-foreground">{fn.avgDuration}</span>
      ),
    },
    {
      key: "lastRun",
      header: "Last Run",
      className: "text-right",
      render: (fn: typeof functions[0]) => (
        <span className="text-muted-foreground">{fn.lastRun}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (fn: typeof functions[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/functions/${fn.id}`)}>
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/functions/${fn.id}?tab=invoke`)}>
              <Play className="h-3.5 w-3.5 mr-2" />
              Invoke
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-3.5 w-3.5 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Functions"
        description="Manage your serverless functions"
        actions={
          <Button asChild>
            <Link to="/functions/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Function
            </Link>
          </Button>
        }
      />

      {/* Search and filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 bg-background"
          />
        </div>
      </div>

      {/* Functions Table */}
      <div className="bg-surface border border-border rounded-md">
        {filteredFunctions.length === 0 && searchQuery === "" ? (
          <EmptyState
            icon={<Plus className="h-6 w-6 text-muted-foreground" />}
            title="No functions yet"
            description="Create your first serverless function to get started"
            action={
              <Button asChild>
                <Link to="/functions/create">Create Function</Link>
              </Button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredFunctions}
            emptyMessage="No functions match your search"
          />
        )}
      </div>
    </AppLayout>
  );
}
