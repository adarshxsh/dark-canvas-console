import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, FileCode, Container } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, name: "Source" },
  { id: 2, name: "Runtime & Resources" },
  { id: 3, name: "Metadata" },
  { id: 4, name: "Review" },
];

const sourceTypes = [
  { id: "inline", name: "Inline Code", icon: FileCode, description: "Write code directly" },
  { id: "zip", name: "Zip Upload", icon: Upload, description: "Upload a .zip file" },
  { id: "docker", name: "Docker Image", icon: Container, description: "Use a container" },
];

const runtimes = [
  { value: "go1.21", label: "Go 1.21" },
  { value: "go1.20", label: "Go 1.20" },
  { value: "go1.19", label: "Go 1.19" },
];

export default function CreateFunction() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sourceType: "inline",
    code: `package main

import (
    "context"
    "encoding/json"
)

func Handler(ctx context.Context, event json.RawMessage) (interface{}, error) {
    return map[string]string{"message": "Hello, World!"}, nil
}`,
    runtime: "go1.21",
    memory: 128,
    timeout: 30,
    envVars: [{ key: "", value: "" }],
    tags: "",
  });

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.code;
      case 2:
        return formData.runtime && formData.memory && formData.timeout;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleCreate = () => {
    // In a real app, this would call the API
    console.log("Creating function:", formData);
    navigate("/functions");
  };

  const estimatedCost = ((formData.memory / 1024) * (formData.timeout / 1000) * 0.0000166667).toFixed(6);

  return (
    <AppLayout>
      <PageHeader
        title="Create Function"
        description="Set up a new serverless function"
        actions={
          <Button variant="ghost" onClick={() => navigate("/functions")}>
            Cancel
          </Button>
        }
      />

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-muted text-foreground"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
                <span className="hidden sm:inline">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-surface border border-border rounded-md p-6 mb-6">
        {/* Step 1: Source */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Function Name</Label>
              <Input
                id="name"
                placeholder="my-function"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="max-w-md bg-background font-mono"
              />
            </div>

            <div className="space-y-3">
              <Label>Source Type</Label>
              <div className="grid grid-cols-3 gap-3 max-w-xl">
                {sourceTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateFormData("sourceType", type.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-md border text-center micro-transition",
                      formData.sourceType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <type.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{type.name}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {formData.sourceType === "inline" && (
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={(e) => updateFormData("code", e.target.value)}
                  className="font-mono text-sm h-64 bg-terminal resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Runtime & Resources */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-xl">
            <div className="space-y-2">
              <Label>Runtime</Label>
              <Select
                value={formData.runtime}
                onValueChange={(value) => updateFormData("runtime", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {runtimes.map((runtime) => (
                    <SelectItem key={runtime.value} value={runtime.value}>
                      {runtime.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Memory (MB)</Label>
                <span className="text-sm text-muted-foreground">{formData.memory} MB</span>
              </div>
              <Slider
                value={[formData.memory]}
                onValueChange={([value]) => updateFormData("memory", value)}
                min={128}
                max={3008}
                step={64}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>128 MB</span>
                <span>3008 MB</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min={1}
                max={900}
                value={formData.timeout}
                onChange={(e) => updateFormData("timeout", parseInt(e.target.value) || 30)}
                className="max-w-32 bg-background"
              />
            </div>

            <div className="p-3 rounded-md bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                Estimated cost per invocation:{" "}
                <span className="font-mono text-foreground">${estimatedCost}</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Metadata */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-xl">
            <div className="space-y-3">
              <Label>Environment Variables</Label>
              {formData.envVars.map((env, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="KEY"
                    value={env.key}
                    onChange={(e) => {
                      const newEnvVars = [...formData.envVars];
                      newEnvVars[index].key = e.target.value;
                      updateFormData("envVars", newEnvVars);
                    }}
                    className="flex-1 font-mono bg-background"
                  />
                  <Input
                    placeholder="value"
                    value={env.value}
                    onChange={(e) => {
                      const newEnvVars = [...formData.envVars];
                      newEnvVars[index].value = e.target.value;
                      updateFormData("envVars", newEnvVars);
                    }}
                    className="flex-1 bg-background"
                  />
                  {index === formData.envVars.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        updateFormData("envVars", [...formData.envVars, { key: "", value: "" }]);
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="production, api, payments"
                value={formData.tags}
                onChange={(e) => updateFormData("tags", e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground">Review your function configuration</h3>
            
            <div className="grid gap-4 max-w-xl">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Name</span>
                <span className="font-mono">{formData.name || "-"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Source</span>
                <span className="capitalize">{formData.sourceType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Runtime</span>
                <span>{formData.runtime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Memory</span>
                <span>{formData.memory} MB</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Timeout</span>
                <span>{formData.timeout}s</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Environment Variables</span>
                <span>{formData.envVars.filter((e) => e.key).length} configured</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Estimated Cost/Invocation</span>
                <span className="font-mono">${estimatedCost}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary">Save Draft</Button>
            <Button onClick={handleCreate}>Create Function</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
