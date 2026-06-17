"use client";

import {
  Camera,
  CheckCircle2,
  Clock3,
  FileSignature,
  FileUp,
  MapPinned,
  PauseCircle,
  PlayCircle,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import type { AdminJob } from "@/types";
import { TechnicianActionButton } from "./technician-action-button";
import { getTechnicianJobProgress, technicianPhotos } from "./technician-utils";

export function TechnicianStatusWorkflow({ job }: { job: AdminJob }) {
  const [workflowStatus, setWorkflowStatus] = useState(job.status);
  const [captureOpen, setCaptureOpen] = useState<"photos" | "signature" | null>(null);
  const progress = getTechnicianJobProgress(workflowStatus);

  return (
    <Card className="border-border bg-card p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Field Workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update status, capture proof of work, collect signature, and send completion notes.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm text-muted-foreground">
              <span>Completion readiness</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-6 grid gap-3">
            <TechnicianActionButton
              className="justify-start bg-blue-600 hover:bg-blue-700"
              feedbackTitle="Job started"
              onClick={() => setWorkflowStatus("in_progress")}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Job / Record Start Time
            </TechnicianActionButton>
            <TechnicianActionButton
              variant="outline"
              className="justify-start"
              feedbackTitle="Job placed on hold"
              onClick={() => setWorkflowStatus("on_hold")}
            >
              <PauseCircle className="mr-2 h-4 w-4" />
              Put On Hold
            </TechnicianActionButton>
            <TechnicianActionButton
              variant="outline"
              className="justify-start"
              feedbackTitle="Arrival geo-fence captured"
              onClick={() => setWorkflowStatus("in_progress")}
            >
              <MapPinned className="mr-2 h-4 w-4" />
              Confirm On-Site Arrival
            </TechnicianActionButton>
            <TechnicianActionButton
              variant="outline"
              className="justify-start"
              feedbackTitle="Job completed"
              onClick={() => setWorkflowStatus("completed")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Job / Record Completion
            </TechnicianActionButton>
          </div>

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <Clock3 className="mb-2 h-4 w-4" />
            Backend will persist status changes, GPS stamps, start/completion timestamps, and dispatcher notifications.
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="technician-notes">
              Work notes
            </label>
            <Textarea
              id="technician-notes"
              rows={6}
              placeholder="Parts used, findings, access notes, and work completed"
              defaultValue={job.specialInstructions}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-foreground">Photo checklist</p>
                <Camera className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-2">
                {technicianPhotos.map((photo, index) => (
                  <label key={photo} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4" />
                    {photo}
                  </label>
                ))}
              </div>
              <TechnicianActionButton
                variant="outline"
                className="mt-4 w-full justify-start"
                feedbackTitle="Photo upload opened"
                onClick={() => setCaptureOpen("photos")}
              >
                <FileUp className="mr-2 h-4 w-4" />
                Upload Photos
              </TechnicianActionButton>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-foreground">Customer signature</p>
                <FileSignature className="h-5 w-5 text-blue-700" />
              </div>
              <Input defaultValue={job.customerName} className="mb-3" />
              <div className="grid h-24 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                Signature capture pad
              </div>
              <TechnicianActionButton
                variant="outline"
                className="mt-4 w-full justify-start"
                feedbackTitle="Signature capture opened"
                onClick={() => setCaptureOpen("signature")}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Capture Signature
              </TechnicianActionButton>
            </div>
          </div>

          <TechnicianActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Completion package sent">
            <Send className="mr-2 h-4 w-4" />
            Send Update To Dispatch
          </TechnicianActionButton>
        </div>
      </div>

      <Dialog open={Boolean(captureOpen)} onOpenChange={(open) => !open && setCaptureOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{captureOpen === "photos" ? "Upload Job Photos" : "Capture Customer Signature"}</DialogTitle>
            <DialogDescription>
              {job.jobNumber} / {job.customerName}
            </DialogDescription>
          </DialogHeader>
          {captureOpen === "photos" ? (
            <div className="grid gap-3">
              {technicianPhotos.map((photo) => (
                <div key={photo} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium text-foreground">{photo}</span>
                  <Input type="file" className="max-w-52" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Signature capture pad for {job.customerName}
            </div>
          )}
          <DialogFooter>
            <TechnicianActionButton variant="outline" feedbackTitle="Capture cancelled" onClick={() => setCaptureOpen(null)}>Cancel</TechnicianActionButton>
            <TechnicianActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle={captureOpen === "photos" ? "Photos attached" : "Signature saved"} onClick={() => setCaptureOpen(null)}>
              Save
            </TechnicianActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
