import React, { useState } from "react";
import { Search, Book, Globe, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { geminiService } from "@/src/lib/gemini";
import { TermResult } from "@/src/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";

export default function TermResearch() {
  const [term, setTerm] = useState("");
  const [sourceLang, setSourceLang] = useState("Italian");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TermResult | null>(null);

  const handleSearch = async () => {
    if (!term.trim()) return;
    
    setLoading(true);
    try {
      const data = await geminiService.researchTerm(term, sourceLang);
      setResult(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Inserisci un termine da ricercare..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Ricerca..." : "Cerca"}
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Lingua di input:</span>
          <Input
            placeholder="Es. Italiano"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </motion.div>
        ) : result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-4xl font-bold tracking-tight">{result.term}</h2>
                <p className="text-muted-foreground mt-1">
                  Trovate {result.meanings.length} accezioni/significati
                </p>
              </div>
              <Globe className="h-8 w-8 text-primary opacity-20" />
            </div>

            {result.meanings.map((meaning, index) => (
              <Card key={index} className="overflow-hidden border-l-4 border-l-primary relative">
                <div className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Accezione {index + 1}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Book className="h-4 w-4" /> Definizione & Traduzioni
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed font-medium">{meaning.definition}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 border relative group">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Italiano</div>
                      <div className="text-lg font-semibold text-primary">{meaning.translations.it}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border relative group">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">English</div>
                      <div className="text-lg font-semibold text-primary">{meaning.translations.en}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border relative group">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Français</div>
                      <div className="text-lg font-semibold text-primary">{meaning.translations.fr}</div>
                    </div>
                  </div>

                  {meaning.note && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-3 rounded-md text-sm text-amber-800 dark:text-amber-200 italic">
                      <strong>Nota:</strong> {meaning.note}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground">Contesto</h4>
                      <p className="text-sm italic text-muted-foreground border-l-2 border-muted pl-4">
                        "{meaning.context}"
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-muted-foreground">Sinonimi</h4>
                      <div className="flex flex-wrap gap-2">
                        {meaning.synonyms.map((syn, i) => (
                          <Badge key={i} variant="secondary" className="text-[11px]">
                            {syn}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
            <Search className="h-12 w-12 mb-4 opacity-20" />
            <p>Inizia una ricerca terminologica per visualizzare tutti i significati in IT, EN, FR</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
