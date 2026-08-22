import { Badge } from '@/components/ui/badge';

export default function RiskFactorsPanel({ factors }: { factors: any[] }) {
  if (!factors || factors.length === 0) return null;
  
  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-lg font-semibold tracking-tight">Risk Factors</h4>
      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.id} className="flex items-start space-x-4 p-3 border rounded-lg bg-card">
            <div className="font-bold text-red-500 w-12 pt-1">+{f.scoreContribution}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-sm">{f.name}</p>
                <Badge variant="outline" className="text-xs">{f.severity}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{f.explanation}</p>
              {f.evidence && (
                <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">{f.evidence}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
