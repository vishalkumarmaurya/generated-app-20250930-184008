import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, BarChart, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { DashboardSummary, Application, ApplicationStatus } from '@shared/types';
import { cn } from '@/lib/utils';
const StatCard = ({ title, value, icon: Icon, loading }: { title: string; value: string; icon: React.ElementType; loading: boolean }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-3/4" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);
const statusStyles: { [key in ApplicationStatus]: string } = {
  'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'In Review': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};
const ApplicationStatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <Badge variant="outline" className={cn("border-transparent", statusStyles[status])}>
    {status}
  </Badge>
);
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
export function HomePage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, applicationsData] = await Promise.all([
          api<DashboardSummary>('/api/dashboard-summary'),
          api<Application[]>('/api/applications'),
        ]);
        setSummary(summaryData);
        setApplications(applicationsData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome Back, Farmer!</h1>
        <p className="text-lg text-muted-foreground">Here's a summary of your agricultural financial aid.</p>
      </div>
      {error && <p className="text-red-500 text-center py-8">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard title="Total Loan Amount" value={summary ? formatCurrency(summary.totalLoanAmount) : '₹0'} icon={DollarSign} loading={loading} />
        <StatCard title="Subsidies Received" value={summary ? formatCurrency(summary.totalSubsidiesReceived) : '₹0'} icon={BarChart} loading={loading} />
        <StatCard title="Applications In Review" value={summary ? String(summary.applicationsInReview) : '0'} icon={Clock} loading={loading} />
        <StatCard title="Approved Applications" value={summary ? String(summary.approvedApplications) : '0'} icon={CheckCircle} loading={loading} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Recent Applications</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Application Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                  </TableRow>
                ))
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow 
                    key={app.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/application/${app.id}`)}
                  >
                    <TableCell className="font-medium">{app.schemeName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{app.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{new Date(app.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(app.amount)}</TableCell>
                    <TableCell className="text-center">
                      <ApplicationStatusBadge status={app.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}