import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Plus, Trash2, Loader2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PaymentMethod } from "@shared/schema";

export default function PaymentMethods() {
  const { toast } = useToast();
  const sessionId = 'default-session';
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cardType: "Visa"
  });

  const { data: methods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods", sessionId],
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/payment-methods?sessionId=${sessionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods", sessionId] });
      setShowAddForm(false);
      setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cardType: "Visa" });
      toast({ title: "Card Saved", description: "Your payment method has been added." });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/payment-methods/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods", sessionId] });
      toast({ title: "Card Removed", description: "Payment method deleted successfully." });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    addMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {methods && methods.length > 0 ? (
        <div className="space-y-3">
          {methods.map((method) => (
            <Card key={method.id} className="relative overflow-hidden border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded border border-gray-100 shadow-sm">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      •••• •••• •••• {method.cardNumber.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase">{method.cardType} • Exp: {method.expiryDate}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteMutation.mutate(method.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showAddForm && (
        <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-200">
          <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No saved cards yet</p>
        </div>
      )}

      {showAddForm ? (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input 
                placeholder="Cardholder Name" 
                value={formData.cardHolder}
                onChange={e => setFormData({...formData, cardHolder: e.target.value})}
              />
              <Input 
                placeholder="Card Number (16 digits)" 
                maxLength={16}
                value={formData.cardNumber}
                onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="MM/YY" 
                  maxLength={5}
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.cardType}
                  onChange={e => setFormData({...formData, cardType: e.target.value})}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Save Card
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowAddForm(true)} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Card
        </Button>
      )}
    </div>
  );
}