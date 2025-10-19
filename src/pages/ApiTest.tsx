import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Database } from 'lucide-react';
import { devicesApi, simCardsApi, usersApi, activationsApi, topupsApi } from '@/services/api';

interface TestResult {
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  data?: any;
  error?: string;
}

export default function ApiTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testEndpoints = async () => {
    setTesting(true);
    setResults([]);

    const endpoints = [
      { name: 'Devices', fn: devicesApi.getAll },
      { name: 'SIM Cards', fn: simCardsApi.getAll },
      { name: 'Users', fn: usersApi.getAll },
      { name: 'Activations', fn: activationsApi.getAll },
      { name: 'Topups', fn: topupsApi.getAll },
    ];

    for (const endpoint of endpoints) {
      try {
        const data = await endpoint.fn();
        setResults(prev => [
          ...prev,
          {
            endpoint: endpoint.name,
            status: 'success',
            message: `Successfully fetched ${Array.isArray(data) ? data.length : 0} records`,
            data: Array.isArray(data) ? data.slice(0, 2) : data, // Show only first 2 records
          },
        ]);
      } catch (error: any) {
        setResults(prev => [
          ...prev,
          {
            endpoint: endpoint.name,
            status: 'error',
            error: error.message || 'Unknown error',
          },
        ]);
      }
    }

    setTesting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Connection Test</h1>
        <p className="text-muted-foreground mt-2">
          Test connectivity to your MySQL database through the PHP API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection
          </CardTitle>
          <CardDescription>
            API Base URL: https://chargi.store/apis/dashboard/
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testEndpoints} 
            disabled={testing}
            className="w-full sm:w-auto"
          >
            {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {testing ? 'Testing...' : 'Test All Endpoints'}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{result.endpoint}</span>
                  {result.status === 'success' ? (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Success
                    </Badge>
                  ) : result.status === 'error' ? (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Testing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.status === 'success' && (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">{result.message}</p>
                    {result.data && (
                      <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </>
                )}
                {result.status === 'error' && (
                  <div className="text-sm text-destructive">
                    <p className="font-semibold">Error:</p>
                    <p className="mt-1">{result.error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
