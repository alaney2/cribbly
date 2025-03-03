import { headers } from "next/headers";

interface VenmoTransaction {
  id: string;
  status: string;
  action: string;
  amount: number;
  date_created: string;
  note: string;
  target: {
    user: {
      username: string;
      display_name: string;
    };
  };
}

export class VenmoClient {
  private baseUrl = "https://api.integuru.ai/venmo";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "INTEGURU-TOKEN": this.token,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async authenticate(): Promise<void> {
    // Verify the token works by checking balance
    await this.getBalance();
  }

  async getBalance(): Promise<number> {
    const response = await this.makeRequest("/get_balance");
    if (response.status !== "success") {
      throw new Error("Failed to get balance");
    }
    return Number.parseFloat(response.balance);
  }

  async getTransactions(): Promise<VenmoTransaction[]> {
    const response = await this.makeRequest("/get_transactions");
    if (response.status !== "success") {
      throw new Error("Failed to get transactions");
    }
    return response.venmo_response.data;
  }

  async transfer(params: {
    recipientId: string;
    amount: number;
    note: string;
  }): Promise<{
    success: boolean;
    data?: {
      transactionId: string;
    };
    error?: string;
  }> {
    try {
      const response = await this.makeRequest("/pay", {
        method: "POST",
        body: JSON.stringify({
          recipient_id: params.recipientId,
          dollar_amount: params.amount,
          note: params.note,
        }),
      });

      if (response.status !== "success") {
        throw new Error("Transfer failed");
      }

      return {
        success: true,
        data: {
          transactionId: response.venmo_response.data.payment.id,
        },
      };
    } catch (error: any) {
      console.error("Venmo transfer error:", error);
      return {
        success: false,
        error: error.message || "Failed to complete Venmo transfer",
      };
    }
  }

  async requestMoney(params: {
    recipientId: string;
    amount: number;
    note: string;
  }): Promise<{
    success: boolean;
    data?: {
      transactionId: string;
    };
    error?: string;
  }> {
    try {
      const response = await this.makeRequest("/request", {
        method: "POST",
        body: JSON.stringify({
          recipient_id: params.recipientId,
          dollar_amount: params.amount,
          note: params.note,
        }),
      });

      if (response.status !== "success") {
        throw new Error("Request failed");
      }

      return {
        success: true,
        data: {
          transactionId: response.venmo_response.data.payment.id,
        },
      };
    } catch (error: any) {
      console.error("Venmo request error:", error);
      return {
        success: false,
        error: error.message || "Failed to complete Venmo request",
      };
    }
  }
}
