import { useEffect, useState, useMemo } from 'react';
import { Tractor, Leaf, Banknote, Factory, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from '@/lib/api-client';
import type { Scheme } from '@shared/types';
const iconMap: { [key: string]: LucideIcon } = {
  Tractor,
  Leaf,
  Banknote,
  Factory,
};
const SchemeCard = ({ scheme }: { scheme: Scheme }) => {
  const Icon = iconMap[scheme.icon] || Leaf;
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{scheme.title}</CardTitle>
          <Badge variant={scheme.type === 'Loan' ? 'destructive' : 'default'} className={scheme.type === 'Loan' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'}>
            {scheme.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardDescription className="flex-grow mb-4">{scheme.description}</CardDescription>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span className="font-medium text-foreground">Max Amount:</span>
            <span>{scheme.maxAmount}</span>
          </div>
          {scheme.interestRate && (
            <div className="flex justify-between">
              <span className="font-medium text-foreground">Interest:</span>
              <span>{scheme.interestRate}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
const SchemesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="space-y-2 flex-grow mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="space-y-2 text-sm">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
export function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Loan' | 'Subsidy'>('All');
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const data = await api<Scheme[]>('/api/schemes');
        setSchemes(data);
      } catch (err) {
        setError('Failed to load schemes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);
  const filteredSchemes = useMemo(() => {
    if (filter === 'All') {
      return schemes;
    }
    return schemes.filter((scheme) => scheme.type === filter);
  }, [schemes, filter]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="space-y-4 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Available Schemes</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover various government loans and subsidies to support your agricultural needs.
        </p>
      </div>
      <div className="flex justify-center mb-12">
        <ToggleGroup
          type="single"
          defaultValue="All"
          value={filter}
          onValueChange={(value) => {
            if (value) setFilter(value as 'All' | 'Loan' | 'Subsidy');
          }}
          aria-label="Filter schemes by type"
        >
          <ToggleGroupItem value="All" aria-label="Show all">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="Loan" aria-label="Show loans">
            Loans
          </ToggleGroupItem>
          <ToggleGroupItem value="Subsidy" aria-label="Show subsidies">
            Subsidies
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {loading ? (
        <SchemesSkeleton />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-muted-foreground">No schemes found for the selected filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}