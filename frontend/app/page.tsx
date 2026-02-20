import Link from "next/link";
import { Package, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BeerStats, Beer } from "@/types";
import { getBeerStats, getFeaturedBeers } from "@/lib/api/beer";
import BeerCard from "@/components/BeerCard";

export const dynamic = "force-dynamic";

async function StatsSection() {
  let stats: BeerStats | null = null;

  try {
    stats = await getBeerStats();
  } catch (error) {
    console.error(error);
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bieres disponibles</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">referencees</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prix moyen TTC</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averagePriceTtc.toFixed(2)} EUR</div>
          <p className="text-xs text-muted-foreground">par reference</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Styles populaires</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats.byType.slice(0, 5).map((item) => (
              <Badge key={item.type} variant="secondary">
                {item.type} ({item.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function FeaturedBeers() {
  let beers: Beer[] = [];

  try {
    beers = await getFeaturedBeers(6);
  } catch (error) {
    console.error(error);
  }

  if (beers.length === 0) {
    return <div className="text-center py-12 text-gray-500">Aucune biere disponible pour le moment</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {beers.map((beer) => (
        <BeerCard key={beer._id} beer={beer} />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Decouvrez notre catalogue de bieres</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">References variees, styles du monde entier, livraison rapide.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/beers">Voir le catalogue</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/orders">Suivre les commandes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main>
      <Hero />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Notre selection en chiffres</h2>
        <StatsSection />
      </div>

      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Bieres a la une</h2>
          <FeaturedBeers />
        </div>
      </div>
    </main>
  );
}
