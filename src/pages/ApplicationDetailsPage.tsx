import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  ChevronLeft,
  Calendar,
  Landmark,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Application, ApplicationEvent, ApplicationStatus } from '@shared/types';
import { cn } from '@/lib/utils';
const statusStyles: { [key in ApplicationStatus | 'Submitted']: string } = {
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'In Review': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};
const statusIcons: { [key in ApplicationStatus | 'Submitted']: React.ElementType } = {
  Submitted: Mail,
  'In Review': Clock,
  Approved: CheckCircle2,
  Rejected: XCircle,
};
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
const ApplicationTimeline = ({ events }: { events: ApplicationEvent[] | undefined }) => (
  <Card>
    <CardHeader>
      <CardTitle>Application History</CardTitle>
      <CardDescription>Follow the journey of your application from submission to decision.</CardDescription>
    </CardHeader>
    <CardContent>
      {events && events.length > 0 ? (
        <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-2">
          {events.map((event, index) => {
            const Icon = statusIcons[event.status];
            return (
              <li key={index} className="mb-10 ms-6">
                <span className={cn("absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900", statusStyles[event.status])}>
                  <Icon className="w-3 h-3" />
                </span>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                  <div className="items-center justify-between sm:flex">
                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{event.status}</div>
                  </div>
                  <div className="p-3 text-sm font-normal text-gray-500 bg-gray-50 rounded-lg dark:bg-gray-600 dark:text-gray-300 mt-3">
                    {event.description}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No application history available.
        </div>
      )}
    </CardContent>
  </Card>
);
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-muted-foreground mt-1" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);
const ApplicationDetailsSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <Skeleton className="h-8 w-48 mb-12" />
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
export function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setError("Application ID is missing.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api<Application>(`/api/application/${id}`);
        setApplication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load application details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) {
    return <ApplicationDetailsSkeleton />;
  }
  if (error || !application) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error || 'Application not found.'}</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/"><ChevronLeft className="w-4 h-4 mr-2" />Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-12">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/"><ChevronLeft className="w-4 h-4 mr-2" />Back to Dashboard</Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{application.schemeName}</h1>
        <p className="text-lg text-muted-foreground">Application ID: {application.id}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={cn("border-transparent text-base", statusStyles[application.status])}>
                  {application.status}
                </Badge>
              </div>
              <DetailItem icon={Landmark} label="Amount" value={formatCurrency(application.amount)} />
              <DetailItem icon={Info} label="Type" value={application.type} />
              <DetailItem icon={Calendar} label="Application Date" value={new Date(application.applicationDate).toLocaleDateString()} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Mock documents for review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Application Form.pdf
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Identity_Proof.pdf
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" /> Land_Records.pdf
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <ApplicationTimeline events={application.events} />
        </div>
      </div>
    </div>
  );
}