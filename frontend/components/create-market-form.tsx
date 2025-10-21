"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface CreateMarketFormProps {
  onCreateMarket: (marketData: {
    title: string;
    description: string;
    endTime: number;
    outcomes: string[];
    tokenDecimals: number;
  }) => Promise<void>;
}

export function CreateMarketForm({ onCreateMarket }: CreateMarketFormProps) {
  const { publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endTime, setEndTime] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>(["Yes", "No"]);
  const [newOutcome, setNewOutcome] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addOutcome = () => {
    if (newOutcome.trim() && !outcomes.includes(newOutcome.trim())) {
      setOutcomes([...outcomes, newOutcome.trim()]);
      setNewOutcome("");
    }
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !title || !description || !endTime) return;

    setIsLoading(true);
    try {
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
      await onCreateMarket({
        title,
        description,
        endTime: endTimestamp,
        outcomes,
        tokenDecimals: 9,
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setEndTime("");
      setOutcomes(["Yes", "No"]);
    } catch (error) {
      console.error("Error creating market:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please connect your wallet to create a market.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Prediction Market</CardTitle>
        <CardDescription>
          Set up a new prediction market for others to participate in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Market Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about this prediction market..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date & Time</label>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Outcome Options</label>
            <div className="space-y-2">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...outcomes];
                      newOutcomes[index] = e.target.value;
                      setOutcomes(newOutcomes);
                    }}
                    className="flex-1"
                  />
                  {outcomes.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOutcome(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="flex space-x-2">
                <Input
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="Add new outcome..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOutcome())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOutcome}
                  disabled={!newOutcome.trim() || outcomes.includes(newOutcome.trim())}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !title || !description || !endTime}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Creating Market..." : "Create Market"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
