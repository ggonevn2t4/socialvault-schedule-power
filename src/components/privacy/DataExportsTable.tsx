import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DataExport, usePrivacy } from '@/hooks/usePrivacy';
import { Download, Plus, FileText, Calendar, HardDrive } from 'lucide-react';

interface DataExportsTableProps {
  exports: DataExport[];
  loading: boolean;
}

export function DataExportsTable({ exports, loading }: DataExportsTableProps) {
  const { requestDataExport } = usePrivacy();
  const [showNewExport, setShowNewExport] = useState(false);
  const [exportType, setExportType] = useState('full');
  const [exportFormat, setExportFormat] = useState('json');
  const [requesting, setRequesting] = useState(false);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Ready</Badge>;
      case 'pending':
        return <Badge variant="secondary">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const handleRequestExport = async () => {
    setRequesting(true);
    try {
      await requestDataExport(exportType, exportFormat);
      setShowNewExport(false);
    } finally {
      setRequesting(false);
    }
  };

  const handleDownload = (exportItem: DataExport) => {
    if (exportItem.file_path && exportItem.status === 'completed' && !isExpired(exportItem.expires_at)) {
      // In a real implementation, this would trigger a secure download
      window.open(exportItem.file_path, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {exports.length} export(s) requested
          </p>
        </div>
        <Dialog open={showNewExport} onOpenChange={setShowNewExport}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Export
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Data Export</DialogTitle>
              <DialogDescription>
                Request a download of your data. Exports are available for 7 days after completion.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="export-type">Export Type</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Data - Everything</SelectItem>
                    <SelectItem value="posts">Posts Only</SelectItem>
                    <SelectItem value="profile">Profile Data</SelectItem>
                    <SelectItem value="analytics">Analytics Data</SelectItem>
                    <SelectItem value="media">Media Files</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-format">Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON - Machine readable</SelectItem>
                    <SelectItem value="csv">CSV - Spreadsheet format</SelectItem>
                    <SelectItem value="pdf">PDF - Human readable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewExport(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestExport} disabled={requesting}>
                  {requesting ? 'Requesting...' : 'Request Export'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {exports.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No data exports requested yet</p>
          <p className="text-sm">Request an export to download your data</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exports.map((exportItem) => (
              <TableRow key={exportItem.id}>
                <TableCell>
                  {getStatusBadge(exportItem.status)}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {exportItem.export_type}
                </TableCell>
                <TableCell className="uppercase">
                  {exportItem.export_format}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    {formatFileSize(exportItem.file_size)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(exportItem.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  {exportItem.expires_at ? (
                    <div className={`flex items-center gap-1 ${isExpired(exportItem.expires_at) ? 'text-destructive' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      {new Date(exportItem.expires_at).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {exportItem.status === 'completed' && !isExpired(exportItem.expires_at) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(exportItem)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {exportItem.status === 'pending' ? 'Processing...' : 
                       isExpired(exportItem.expires_at) ? 'Expired' : 'Not ready'}
                    </span>
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