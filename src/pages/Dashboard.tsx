
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Send, 
  History, 
  User, 
  LogOut, 
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  recipient?: string;
}

interface User {
  id: string;
  username: string;
  role: string;
  accountBalance: number;
  email?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [transferData, setTransferData] = useState({
    recipient: "",
    amount: "",
    description: ""
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // VULNERABILITY: Insecure Direct Object Reference
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 2500.00,
        description: "Salary Deposit",
        date: "2024-01-15",
      },
      {
        id: "2",
        type: "debit",
        amount: 150.00,
        description: "Grocery Store",
        date: "2024-01-14",
      },
      {
        id: "3",
        type: "debit",
        amount: 75.50,
        description: "Gas Station",
        date: "2024-01-13",
      }
    ];
    setTransactions(mockTransactions);
  }, [navigate]);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // VULNERABILITY: Insufficient input validation
    const amount = parseFloat(transferData.amount);
    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    
    // VULNERABILITY: Race condition - no proper locking mechanism
    if (user && amount <= user.accountBalance) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "debit",
        amount: amount,
        description: transferData.description || "Money Transfer",
        date: new Date().toISOString().split('T')[0],
        recipient: transferData.recipient
      };
      
      // VULNERABILITY: Direct manipulation of balance without server validation
      const updatedUser = {
        ...user,
        accountBalance: user.accountBalance - amount
      };
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setTransactions([newTransaction, ...transactions]);
      
      // VULNERABILITY: Exposed sensitive information in console
      console.log("Transfer executed:", {
        from: user.username,
        to: transferData.recipient,
        amount: amount,
        balance: updatedUser.accountBalance
      });
      
      toast.success(`$${amount} transferred to ${transferData.recipient}`);
      setTransferData({ recipient: "", amount: "", description: "" });
    } else {
      toast.error("Insufficient funds");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // VULNERABILITY: Exposed admin functionality
  const handleAdminAction = () => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      toast.error("Access denied");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">SecureBank</h1>
              <Badge variant="outline" className="text-xs">
                User ID: {user.id}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.username}</span>
              {user.role === "admin" && (
                <Button onClick={handleAdminAction} variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              )}
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user.accountBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,500.00</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transfer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transfer">Transfer Money</TabsTrigger>
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Money
                </CardTitle>
                <CardDescription>Transfer money to another account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Username</Label>
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="Enter recipient username"
                      value={transferData.recipient}
                      onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="What's this for?"
                      value={transferData.description}
                      onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Transfer Money
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                          {transaction.recipient && (
                            <p className="text-xs text-gray-400">To: {transaction.recipient}</p>
                          )}
                        </div>
                      </div>
                      <div className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{user.username}</div>
                  </div>
                  <div>
                    <Label>User ID</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{user.id}</div>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded capitalize">{user.role}</div>
                  </div>
                  <div>
                    <Label>Account Balance</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">${user.accountBalance.toFixed(2)}</div>
                  </div>
                </div>
                {/* VULNERABILITY: Exposed sensitive information */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <h4 className="font-medium text-yellow-800">Debug Information</h4>
                  <pre className="text-xs text-yellow-700 mt-2 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
