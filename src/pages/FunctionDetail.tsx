import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, Settings2, Code, Activity, ScrollText, Copy, Download, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock function data
const functionData = {
  id: "fn-1",
  name: "process-payment",
  runtime: "go1.21",
  status: "active" as const,
  memory: 256,
  timeout: 30,
  lastRun: "2 min ago",
  invocations: 1432,
  avgDuration: "124ms",
  createdAt: "2024-01-15",
  code: `package main

import (
    "context"
    "encoding/json"
)

type PaymentRequest struct {
    Amount   float64 \`json:"amount"\`
    Currency string  \`json:"currency"\`
    Method   string  \`json:"method"\`
}

func Handler(ctx context.Context, event json.RawMessage) (interface{}, error) {
    var req PaymentRequest
    if err := json.Unmarshal(event, &req); err != nil {
        return nil, err
    }
    
    // Process payment logic here
    return map[string]interface{}{
        "success": true,
        "transactionId": "txn_abc123",
        "amount": req.Amount,
    }, nil
}`,
  envVars: [
    { key: "STRIPE_API_KEY", value: "sk_test_***" },
    { key: "WEBHOOK_URL", value: "https://api.example.com/webhooks" },
  ],
};

const recentLogs = [
  { timestamp: "2024-01-20 14:32:15", level: "info", message: "Function invoked", requestId: "req-abc123" },
  { timestamp: "2024-01-20 14:32:15", level: "info", message: "Processing payment: $99.00 USD", requestId: "req-abc123" },
  { timestamp: "2024-01-20 14:32:16", level: "info", message: "Payment successful: txn_abc123", requestId: "req-abc123" },
  { timestamp: "2024-01-20 14:31:45", level: "error", message: "Invalid currency code: XXX", requestId: "req-def456" },
  { timestamp: "2024-01-20 14:30:22", level: "info", message: "Function invoked", requestId: "req-ghi789" },
];

export default function FunctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [testInput, setTestInput] = useState(`{
  "amount": 99.00,
  "currency": "USD",
  "method": "card"
}`);
  const [testOutput, setTestOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleInvoke = async () => {
    setIsRunning(true);
    setTestOutput("");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    setTestOutput(JSON.stringify({
      success: true,
      transactionId: "txn_" + Math.random().toString(36).substr(2, 9),
      amount: 99.00,
      duration: "124ms",
      memoryUsed: "45 MB",
    }, null, 2));
    setIsRunning(false);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/functions")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold font-mono">{functionData.name}</h1>
              <StatusBadge status="success">Active</StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {functionData.runtime} · {functionData.memory} MB · {functionData.timeout}s timeout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="h-3.5 w-3.5 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start gap-0 p-0 h-auto">
          {[
            { value: "overview", label: "Overview", icon: Activity },
            { value: "code", label: "Code", icon: Code },
            { value: "config", label: "Configuration", icon: Settings2 },
            { value: "invoke", label: "Invoke / Test", icon: Play },
            { value: "logs", label: "Logs", icon: ScrollText },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
                "text-muted-foreground data-[state=active]:text-foreground"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-md p-4">
              <p className="text-xs text-muted-foreground uppercase">Invocations (24h)</p>
              <p className="text-2xl font-semibold mt-1">{functionData.invocations.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-border rounded-md p-4">
              <p className="text-xs text-muted-foreground uppercase">Avg Duration</p>
              <p className="text-2xl font-semibold mt-1">{functionData.avgDuration}</p>
            </div>
            <div className="bg-surface border border-border rounded-md p-4">
              <p className="text-xs text-muted-foreground uppercase">Memory</p>
              <p className="text-2xl font-semibold mt-1">{functionData.memory} MB</p>
            </div>
            <div className="bg-surface border border-border rounded-md p-4">
              <p className="text-xs text-muted-foreground uppercase">Last Run</p>
              <p className="text-2xl font-semibold mt-1">{functionData.lastRun}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Function Details</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Function ID</dt>
                <dd className="font-mono mt-1">{functionData.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd className="mt-1">{functionData.createdAt}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Runtime</dt>
                <dd className="mt-1">{functionData.runtime}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Timeout</dt>
                <dd className="mt-1">{functionData.timeout} seconds</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="mt-6">
          <div className="bg-terminal border border-border rounded-md">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="text-sm text-muted-foreground font-mono">main.go</span>
              <Button variant="ghost" size="sm" className="h-7">
                <Copy className="h-3.5 w-3.5 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="p-4 overflow-auto text-sm font-mono">
              <code className="text-foreground">{functionData.code}</code>
            </pre>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="mt-6">
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-md p-4">
              <h3 className="text-sm font-medium mb-4">Environment Variables</h3>
              <div className="space-y-2">
                {functionData.envVars.map((env, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                    <span className="font-mono text-sm text-foreground">{env.key}</span>
                    <span className="text-muted-foreground">=</span>
                    <span className="font-mono text-sm text-muted-foreground">{env.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Invoke Tab */}
        <TabsContent value="invoke" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Input (JSON)</h3>
                <Button
                  onClick={handleInvoke}
                  disabled={isRunning}
                  size="sm"
                >
                  <Play className="h-3.5 w-3.5 mr-2" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
              <Textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="font-mono text-sm h-64 bg-terminal resize-none"
                placeholder='{"key": "value"}'
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Output</h3>
              <div className="bg-terminal border border-border rounded-md h-64 overflow-auto">
                {testOutput ? (
                  <pre className="p-4 text-sm font-mono text-foreground">{testOutput}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    {isRunning ? "Executing..." : "Run the function to see output"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="mt-6">
          <div className="bg-terminal border border-border rounded-md">
            <div className="px-4 py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Recent logs</span>
            </div>
            <div className="divide-y divide-border">
              {recentLogs.map((log, i) => (
                <div key={i} className="px-4 py-2 font-mono text-xs flex items-start gap-4 hover:bg-surface-hover">
                  <span className="text-muted-foreground shrink-0">{log.timestamp}</span>
                  <span
                    className={cn(
                      "shrink-0 uppercase w-12",
                      log.level === "error" ? "text-status-error" : "text-muted-foreground"
                    )}
                  >
                    {log.level}
                  </span>
                  <span className="text-foreground">{log.message}</span>
                  <span className="text-muted-foreground ml-auto">{log.requestId}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
