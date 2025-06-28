
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Code, Database, User, Lock } from "lucide-react";

const Vulnerabilities = () => {
  const vulnerabilities = [
    {
      id: "A01",
      title: "Broken Access Control",
      severity: "High",
      icon: <Shield className="h-5 w-5" />,
      description: "Users can access admin panel without proper authorization checks",
      location: "Admin.tsx - Missing role verification",
      exploit: "Navigate directly to /admin URL",
      impact: "Full system access, user data exposure"
    },
    {
      id: "A03", 
      title: "SQL Injection",
      severity: "Critical",
      icon: <Database className="h-5 w-5" />,
      description: "Direct string concatenation in SQL queries without sanitization",
      location: "Index.tsx login, Admin.tsx search",
      exploit: "admin' OR '1'='1 --",
      impact: "Database compromise, data theft"
    },
    {
      id: "A07",
      title: "Cross-Site Scripting (XSS)",
      severity: "Medium",
      icon: <Code className="h-5 w-5" />,
      description: "User input displayed without proper sanitization",
      location: "Dashboard.tsx transaction descriptions",
      exploit: "<script>alert('XSS')</script>",
      impact: "Session hijacking, data theft"
    },
    {
      id: "A02",
      title: "Cryptographic Failures",
      severity: "High", 
      icon: <Lock className="h-5 w-5" />,
      description: "Passwords stored in plain text, sensitive data in localStorage",
      location: "All authentication flows",
      exploit: "Access browser storage",
      impact: "Credential theft, session hijacking"
    },
    {
      id: "A05",
      title: "Security Misconfiguration",
      severity: "Medium",
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Debug information exposed, verbose error messages",
      location: "Admin.tsx configuration display",
      exploit: "View source code, console logs",
      impact: "Information disclosure"
    },
    {
      id: "A04",
      title: "Insecure Direct Object References",
      severity: "High",
      icon: <User className="h-5 w-5" />,
      description: "User IDs exposed in URLs and responses without authorization",
      location: "Dashboard.tsx user profile",
      exploit: "Modify user ID parameters",
      impact: "Unauthorized data access"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            OWASP Top 10 Vulnerabilities
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This banking application intentionally contains security vulnerabilities from the OWASP Top 10 
            for educational and penetration testing purposes. <strong>DO NOT use in production!</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vulnerabilities.map((vuln) => (
            <Card key={vuln.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {vuln.icon}
                    <span>{vuln.id}: {vuln.title}</span>
                  </CardTitle>
                  <Badge variant={getSeverityColor(vuln.severity)}>
                    {vuln.severity}
                  </Badge>
                </div>
                <CardDescription>{vuln.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm">Location:</strong>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded mt-1">
                      {vuln.location}
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm">Example Exploit:</strong>
                    <p className="text-sm text-gray-600 font-mono bg-red-50 p-2 rounded mt-1">
                      {vuln.exploit}
                    </p>
                  </div>
                  <div>
                    <strong className="text-sm">Potential Impact:</strong>
                    <p className="text-sm text-gray-600">{vuln.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Testing Guidelines</h2>
          <div className="space-y-2 text-yellow-700">
            <p>• Use this application only for authorized penetration testing and educational purposes</p>
            <p>• Test SQL injection in login form and admin search</p>
            <p>• Try accessing /admin without proper authentication</p>
            <p>• Inspect browser storage for exposed sensitive data</p>
            <p>• Test XSS in transaction descriptions and form inputs</p>
            <p>• Check for information disclosure in console logs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vulnerabilities;
