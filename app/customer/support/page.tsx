"use client";

import { Bell, ChevronRight, Clock, FileText, Headphones, MessageCircle, Paperclip, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomerActionButton } from "@/components/customer/customer-action-button";
import { formatCustomerPortalDateTime, getCustomerPortalData } from "@/components/customer/customer-data";
import { customerTones } from "@/components/customer/customer-tones";

const data = getCustomerPortalData();
const extraTicket = {
  id: "TCK-4781",
  subject: "Service follow-up question",
  priority: "low" as const,
  status: "resolved" as const,
  createdAt: "2026-04-30T11:02:00",
  lastUpdate: "Answered by support agent on Apr 30, 2026.",
  description: "Customer has a question about the maintenance plan coverage.",
};
const tickets = [...data.tickets, extraTicket];

export default function CustomerSupportPage() {
  const [fileOpen, setFileOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[number] | null>(null);

  return (
    <div className={customerTones.page}>
      <div className="mx-auto w-full max-w-[1760px] space-y-6 px-4 py-8 2xl:px-8">
        <div>
          <Badge className={`mb-4 px-3 py-1.5 ${customerTones.badge.info}`}>
            <Headphones className="mr-2 h-4 w-4" />
            Support desk
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground">
            Support & Notifications
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            Create tickets, follow support updates, and review service communications.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-start gap-5">
              <div className={`grid h-14 w-14 place-items-center rounded-full ${customerTones.icon.blue}`}>
                <Headphones className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">New Support Ticket</h2>
                <p className="mt-1 text-muted-foreground">Send a question, concern, or attachment note.</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2 md:grid-cols-[90px_1fr] md:items-center">
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Subject" />
              </div>
              <div className="grid gap-2 md:grid-cols-[90px_1fr] md:items-center">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule">Scheduling</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="service">Service question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="text-sm font-medium">Tell us what you need help with.</label>
              <Textarea className="min-h-36" placeholder="Describe your question or issue in detail..." />
              <div className="flex items-center justify-between rounded-lg border border-dashed border-border p-4">
                <div className="flex gap-3">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Attach files (optional)</p>
                    <p className="text-sm text-muted-foreground">Upload images, documents, or receipts (max 10MB)</p>
                  </div>
                </div>
                <CustomerActionButton variant="outline" feedbackTitle="File chooser opened" onClick={() => setFileOpen(true)}>
                  Choose files
                </CustomerActionButton>
              </div>
              <CustomerActionButton className="w-fit bg-blue-600 hover:bg-blue-700" feedbackTitle="Support ticket preview opened" onClick={() => setTicketOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </CustomerActionButton>
            </div>
          </Card>

          <Card className="overflow-hidden border-border bg-card shadow-sm">
            <div className="flex items-start gap-5 border-b border-border p-6">
              <div className={`grid h-14 w-14 place-items-center rounded-full ${customerTones.icon.blue}`}>
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Ticket History</h2>
                <p className="mt-1 text-muted-foreground">Open and resolved customer support requests.</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  className="grid w-full gap-4 p-5 text-left transition hover:bg-muted md:grid-cols-[1fr_auto] md:items-center"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div>
                    <p className="font-semibold text-foreground">{ticket.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ticket.id} • {formatCustomerPortalDateTime(ticket.createdAt)}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">{ticket.description}</p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      {ticket.lastUpdate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{ticket.priority}</Badge>
                    <Badge className={ticket.status === "resolved" ? customerTones.badge.success : customerTones.badge.infoSolid}>
                      {ticket.status.replaceAll("_", " ")}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {data.notifications.map((notification, index) => (
            <Card key={notification.id} className="border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={
                    index === 0
                      ? `grid h-14 w-14 place-items-center rounded-lg ${customerTones.icon.emerald}`
                      : index === 1
                        ? `grid h-14 w-14 place-items-center rounded-lg ${customerTones.icon.violet}`
                        : `grid h-14 w-14 place-items-center rounded-lg ${customerTones.icon.blue}`
                  }
                >
                  <Bell className="h-7 w-7" />
                </div>
                <Badge variant="outline">{notification.channel}</Badge>
              </div>
              <p className="text-lg font-semibold text-foreground">{notification.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{notification.message}</p>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatCustomerPortalDateTime(notification.sentAt)}
              </p>
            </Card>
          ))}
        </div>

        <Card className={`border-emerald-200 p-6 shadow-sm ${customerTones.surface.success}`}>
          <div className="flex items-center gap-5">
            <div className={`grid h-16 w-16 place-items-center rounded-full ${customerTones.icon.emerald}`}>
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Support protection</h2>
              <p className="mt-1 text-muted-foreground">Your ticket history and customer communications are securely stored in your customer portal.</p>
            </div>
          </div>
        </Card>

        <Dialog open={fileOpen} onOpenChange={setFileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attach Support Files</DialogTitle>
              <DialogDescription>Upload images, receipts, or documents that help support review your request.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input type="file" />
              <Input type="file" />
              <p className={customerTones.surface.info}>Accepted: JPG, PNG, PDF, DOCX. Maximum 10MB each.</p>
            </div>
            <DialogFooter>
              <CustomerActionButton variant="outline" feedbackTitle="Attachment dialog closed" onClick={() => setFileOpen(false)}>Cancel</CustomerActionButton>
              <CustomerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Files attached" onClick={() => setFileOpen(false)}>Attach Files</CustomerActionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Support Ticket</DialogTitle>
              <DialogDescription>Confirm the request details before it is sent to support.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <TicketLine label="Status" value="Ready to submit" />
              <TicketLine label="Routing" value="Customer support desk" />
              <TicketLine label="Expected response" value="Within 1 business day" />
            </div>
            <DialogFooter>
              <CustomerActionButton variant="outline" feedbackTitle="Ticket review closed" onClick={() => setTicketOpen(false)}>Close</CustomerActionButton>
              <CustomerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Support ticket created" onClick={() => setTicketOpen(false)}>Submit Ticket</CustomerActionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(selectedTicket)} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTicket?.subject}</DialogTitle>
              <DialogDescription>{selectedTicket?.id} / {selectedTicket?.status}</DialogDescription>
            </DialogHeader>
            {selectedTicket ? (
              <div className="grid gap-3">
                <TicketLine label="Created" value={formatCustomerPortalDateTime(selectedTicket.createdAt)} />
                <TicketLine label="Priority" value={selectedTicket.priority} />
                <div className="rounded-lg border border-border p-4">
                  <p className="font-semibold text-foreground">Latest update</p>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedTicket.lastUpdate}</p>
                </div>
              </div>
            ) : null}
            <DialogFooter>
              <CustomerActionButton variant="outline" feedbackTitle="Ticket detail closed" onClick={() => setSelectedTicket(null)}>Close</CustomerActionButton>
              <CustomerActionButton className="bg-blue-600 hover:bg-blue-700" feedbackTitle="Reply composer opened">Reply</CustomerActionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function TicketLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold capitalize text-foreground">{value}</span>
    </div>
  );
}
