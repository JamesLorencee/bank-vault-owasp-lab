
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Users, 
  Database, 
  AlertTriangle, 
  Search,
  Trash2,
  Edit,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  accountBalance: number;
  lastLogin?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlResult, setSqlResult] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    
    const user = JSON.parse(userData);
    setCurrentUser(user);
    
    // VULNERABILITY: Missing authorization check
    // Any user can access admin panel by navigating directly
    
    // Mock user data for admin panel
    const mockUsers: User[] = [
      {
        id: "1",
        username: "admin",
        email: "admin@securebank.com",
        role: "admin",
        accountBalance: 50000.00,
        lastLogin: "2024-01-15"
      },
      {
        id: "2", 
        username: "john_doe",
        email: "john@email.com",
        role: "user",
        accountBalance: 2500.00,
        lastLogin: "2024-01-14"
      },
      {
        id: "3",
        username: "jane_smith", 
        email: "jane@email.com",
        role: "user",
        accountBalance: 1750.50,
        lastLogin: "2024-01-13"
      }
    ];
    setUsers(mockUsers);
  }, [navigate]);

  // VULNERABILITY: SQL Injection in search functionality
  const handleSearch = () => {
    const query = `SELECT * FROM users WHERE username LIKE '%${searchQuery}%' OR email LIKE '%${searchQuery}%'`;
    console.log("Executing search query:", query);
    
    // Simulate SQL injection vulnerability
    if (searchQuery.includes("'") || searchQuery.includes(";")) {
      setSqlResult("SQL Error: Syntax error in query");
      toast.error("Search failed - check console for details");
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("Search results:", filtered);
      toast.success(`Found ${filtered.length} users`);
    }
  };

  // VULNERABILITY: Direct SQL execution without sanitization
  const executeSqlQuery = () => {
    console.log("DANGEROUS: Executing raw SQL query:", sqlQuery);
    
    // Simulate dangerous SQL execution
    if (sqlQuery.toLowerCase().includes("drop") || sqlQuery.toLowerCase().includes("delete")) {
      setSqlResult("⚠️ DESTRUCTIVE QUERY DETECTED!\nQuery: " + sqlQuery + "\nResult: This would delete data in production!");
      toast.error("Destructive query executed!");
    } else if (sqlQuery.toLowerCase().includes("select")) {
      setSqlResult("Query executed successfully.\nRows affected: " + Math.floor(Math.random() * 100));
      toast.success("Query executed");
    } else {
      setSqlResult("Query: " + sqlQuery + "\nResult: Unknown command");
    }
  };

  // VULNERABILITY: Privilege escalation
  const promoteUser = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, role: user.role === "admin" ? "user" : "admin" };
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success("User privileges updated");
  };

  // VULNERABILITY: No confirmation for destructive actions
  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    toast.success("User deleted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate("/dashboard")} 
                variant="ghost" 
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
              <Badge variant="destructive">PRIVILEGED ACCESS</Badge>
            </div>
            <div className="text-sm text-gray-600">
              Logged in as: {currentUser?.username}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 font-medium">
              Warning: This admin panel contains intentional security vulnerabilities for educational purposes.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>Manage system users and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Search users... (try: admin' OR '1'='1)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* User List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        onClick={() => promoteUser(user.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => deleteUser(user.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SQL Query Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Query Tool
              </CardTitle>
              <CardDescription>Execute raw SQL queries (DANGEROUS!)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sql-query">SQL Query</Label>
                <Textarea
                  id="sql-query"
                  placeholder="Enter SQL query... (e.g., SELECT * FROM users; DROP TABLE users;)"
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  className="font-mono text-sm"
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={executeSqlQuery}
                variant="destructive"
                className="w-full"
              >
                Execute Query
              </Button>

              {sqlResult && (
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                  {sqlResult}
                </div>
              )}

              <div className="text-xs text-gray-500">
                <strong>Try these vulnerable queries:</strong><br/>
                • SELECT * FROM users WHERE id = 1; DROP TABLE users;<br/>
                • SELECT password FROM users WHERE username = 'admin'<br/>
                • UPDATE users SET balance = 999999 WHERE id = 1
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                  <div className="text-sm text-blue-700">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    ${users.reduce((sum, user) => sum + user.accountBalance, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-green-700">Total Balance</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-600">
                    {users.filter(user => user.role === "admin").length}
                  </div>
                  <div className="text-sm text-yellow-700">Admin Users</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-600">HIGH</div>
                  <div className="text-sm text-red-700">Security Risk</div>
                </div>
              </div>

              {/* Exposed sensitive configuration */}
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">System Configuration (EXPOSED)</h4>
                <pre className="text-xs text-gray-600 overflow-auto">
{`{
  "database": {
    "host": "localhost:3306",
    "username": "root",
    "password": "admin123",
    "database": "securebank_db"
  },
  "jwt_secret": "super_secret_key_123",
  "encryption_key": "aes256_key_vulnerable",
  "admin_backdoor": "admin_access_2024",
  "debug_mode": true,
  "sql_injection_protection": false,
  "xss_protection": false
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
