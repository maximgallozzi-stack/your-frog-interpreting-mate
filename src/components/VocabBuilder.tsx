import React, { useState } from "react";
import { Plus, Download, Trash2, ListChecks, Globe2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { geminiService } from "@/src/lib/gemini";
import { VocabItem } from "@/src/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";

export default function VocabBuilder() {
  const [domain, setDomain] = useState("");
  const [sourceLang, setSourceLang] = useState("Italian");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<VocabItem[]>([]);

  const handleGenerate = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      // Generating 25 terms for a "larger" glossary
      const data = await geminiService.buildVocabulary(domain, sourceLang, 25);
      setItems(data);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearList = () => setItems([]);

  return (
    <div className="space-y-6">
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-primary" />
            Generatore di Vocabolario Trilingue (25+ termini)
          </CardTitle>
          <CardDescription>
            Inserisci un dominio specifico per generare un glossario tecnico approfondito in Italiano, Inglese e Francese.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Dominio specifico (es. Sostenibilità, Microelettronica)..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Lingua di input:</span>
              <Input
                placeholder="Es. Italiano"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? "Generazione..." : "Genera Glossario"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="space-y-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Glossario Trilingue: <span className="text-primary">{domain}</span>
                <Badge variant="outline" className="ml-2">{items.length} termini</Badge>
              </h3>
              <Button variant="outline" size="sm" onClick={clearList}>
                <Trash2 className="h-4 w-4 mr-2" /> Pulisci
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[20%] bg-muted/50">Termine ({sourceLang})</TableHead>
                      <TableHead className="w-[15%] bg-muted/50">Italiano</TableHead>
                      <TableHead className="w-[15%] bg-muted/50">English</TableHead>
                      <TableHead className="w-[15%] bg-muted/50">Français</TableHead>
                      <TableHead className="bg-muted/50">Nota d'uso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, i) => (
                      <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium">{item.term}</TableCell>
                        <TableCell className="text-primary font-medium">{item.translations.it}</TableCell>
                        <TableCell className="text-primary font-medium">{item.translations.en}</TableCell>
                        <TableCell className="text-primary font-medium">{item.translations.fr}</TableCell>
                        <TableCell className="text-muted-foreground text-xs italic">
                          {item.usage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
            <BookOpen className="h-12 w-12 mb-4 opacity-20" />
            <p>Genera un glossario tecnico trilingue basato su un dominio specifico</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
