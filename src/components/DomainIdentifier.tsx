import React, { useState } from "react";
import { FileText, Target, Lightbulb, Link as LinkIcon, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { geminiService } from "@/src/lib/gemini";
import { DomainResult } from "@/src/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { Separator } from "@/components/ui/separator";

export default function DomainIdentifier() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DomainResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await geminiService.identifyDomain(text);
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5 text-primary" />
          Analisi del Testo e Identificazione Dominio
        </div>
        <Textarea
          placeholder="Incolla qui il testo del discorso o dell'articolo da analizzare..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-y"
        />
        <Button onClick={handleAnalyze} disabled={loading} className="w-full md:w-auto">
          {loading ? "Analisi in corso..." : "Analizza Testo"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ) : result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="md:col-span-2 bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{result.mainDomain}</CardTitle>
                    <CardDescription>Dominio principale identificato</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" /> Sotto-domini & Concetti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h5 className="text-sm font-medium mb-2">Sotto-domini</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.subDomains.map((sd, i) => (
                      <Badge key={i} variant="outline">
                        {sd}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h5 className="text-sm font-medium mb-2">Concetti Chiave</h5>
                  <ul className="space-y-1">
                    {result.keyConcepts.map((kc, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {kc}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Risorse Consigliate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.suggestedResources.map((res, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm group">
                      <LinkIcon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors cursor-default">
                        {res}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            <div className="text-4xl mb-4 opacity-40">🐸</div>
            <p>Analizza un testo per identificare domini e concetti chiave</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
