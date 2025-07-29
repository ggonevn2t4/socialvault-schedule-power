import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PrivacyRequest, usePrivacy } from '@/hooks/usePrivacy';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PrivacyRequestsTableProps {
  requests: PrivacyRequest[];
  loading: boolean;
}

export function PrivacyRequestsTable({ requests, loading }: PrivacyRequestsTableProps) {
  const { submitPrivacyRequest } = usePrivacy();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestType, setRequestType] = useState<PrivacyRequest['request_type']>('export');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatRequestType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleSubmitRequest = async () => {
    if (!requestType || !description.trim()) return;

    setSubmitting(true);
    try {
      await submitPrivacyRequest(requestType, description);
      setDescription('');
      setShowNewRequest(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {requests.length} privacy request(s) submitted
          </p>
        </div>
        <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Privacy Request</DialogTitle>
              <DialogDescription>
                Submit a request for data access, correction, deletion, or other privacy-related actions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="request-type">Request Type</Label>
                <Select value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="export">Data Export - Download my data</SelectItem>
                    <SelectItem value="delete">Data Deletion - Delete my data</SelectItem>
                    <SelectItem value="anonymize">Data Anonymization - Anonymize my data</SelectItem>
                    <SelectItem value="correction">Data Correction - Correct my data</SelectItem>
                    <SelectItem value="portability">Data Portability - Transfer my data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your request in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitRequest} 
                  disabled={submitting || !description.trim()}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No privacy requests submitted yet</p>
          <p className="text-sm">Submit a request to manage your data and privacy</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {getStatusBadge(request.status)}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatRequestType(request.request_type)}
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">
                    {request.description || 'No description provided'}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(request.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {request.completed_at ? (
                    new Date(request.completed_at).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}