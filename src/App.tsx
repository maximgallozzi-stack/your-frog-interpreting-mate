import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Target, Info, Sparkles } from "lucide-react";
import TermResearch from "./components/TermResearch";
import VocabBuilder from "./components/VocabBuilder";
import DomainIdentifier from "./components/DomainIdentifier";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">InterprePrep <span className="text-primary">AI</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden md:inline">Assistente per Interpreti di Conferenza</span>
            <Info className="h-4 w-4 cursor-help" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="research" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl h-12 p-1 bg-muted/50 border shadow-sm">
              <TabsTrigger value="research" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Ricerca Termini</span>
                <span className="sm:hidden">Ricerca</span>
              </TabsTrigger>
              <TabsTrigger value="vocab" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Vocabolario</span>
                <span className="sm:hidden">Vocab</span>
              </TabsTrigger>
              <TabsTrigger value="domain" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Identifica Dominio</span>
                <span className="sm:hidden">Dominio</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="research" className="focus-visible:outline-none focus-visible:ring-0">
              <TermResearch />
            </TabsContent>
            <TabsContent value="vocab" className="focus-visible:outline-none focus-visible:ring-0">
              <VocabBuilder />
            </TabsContent>
            <TabsContent value="domain" className="focus-visible:outline-none focus-visible:ring-0">
              <DomainIdentifier />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <footer className="border-t py-8 mt-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 InterprePrep AI. Strumento professionale di supporto alla preparazione.</p>
        </div>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
}
