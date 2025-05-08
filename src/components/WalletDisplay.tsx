
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export function WalletDisplay() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load wallet from localStorage
    const walletData = localStorage.getItem("wallet");
    if (walletData) {
      const parsedWallet = JSON.parse(walletData);
      setBalance(parsedWallet.balance);
      setTransactions(parsedWallet.transactions || []);
    } else {
      // Initialize wallet with 50,000 Rs
      const initialWallet = {
        balance: 50000,
        transactions: []
      };
      localStorage.setItem("wallet", JSON.stringify(initialWallet));
      setBalance(50000);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-3">
          <Wallet className="h-4 w-4" />
          <span>{formatCurrency(balance)}</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Your Wallet</h3>
            <span className="text-lg font-bold text-primary">{formatCurrency(balance)}</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Recent Transactions</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="text-xs flex justify-between pb-2 border-b border-border">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <span className={transaction.type === 'debit' ? 'text-destructive' : 'text-accent'}>
                      {transaction.type === 'debit' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No recent transactions</p>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
