import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from './useSupabaseAuth';
import { toast } from 'sonner';

export interface OrderHistoryItem {
  id: string;
  user_id: string;
  order_data: any;
  total_amount: number;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  invoice_number: string;
  created_at: string;
  original_order_date: string;
}

export const useOrderHistory = () => {
  const { user } = useSupabaseAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrderHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (orderData: {
    user_id: string;
    order_data: any;
    total_amount: number;
    customer_name: string;
    customer_phone?: string;
    customer_email?: string;
    invoice_number: string;
  }) => {
    try {
      // Authentication is now required for all orders
      if (!user) {
        throw new Error('User authentication required for order history');
      }

      const { error } = await supabase
        .from('order_history')
        .insert([{
          ...orderData,
          user_id: user.id // Ensure user_id matches authenticated user
        }]);

      if (error) throw error;
      
      // Refresh the history
      await fetchOrderHistory();
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [user]);

  return {
    orders,
    loading,
    fetchOrderHistory,
    addToHistory
  };
};