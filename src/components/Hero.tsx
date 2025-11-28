import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [stats, setStats] = useState({
    students: 0,
    resources: 0,
    events: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [profilesResult, resourcesResult, eventsResult] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("resources").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      students: profilesResult.count || 0,
      resources: resourcesResult.count || 0,
      events: eventsResult.count || 0,
    });
  };

  return (
    <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bTAgMjRjMC0xLjEuOS0yIDItMnMyIC45IDIgMi0uOSAyLTIgMi0yLS45LTItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Your Campus, <span className="text-accent">Connected</span>
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            A unified platform for student engagement and resource management. 
            Stay connected, organized, and informed - all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="gap-2 text-lg">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground">
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <Users className="w-8 h-8 mb-3 mx-auto text-accent" />
              <div className="text-3xl font-bold mb-1">{stats.students}</div>
              <div className="text-sm text-primary-foreground/80">Active Students</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <BookOpen className="w-8 h-8 mb-3 mx-auto text-accent" />
              <div className="text-3xl font-bold mb-1">{stats.resources}</div>
              <div className="text-sm text-primary-foreground/80">Resources</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20">
              <Calendar className="w-8 h-8 mb-3 mx-auto text-accent" />
              <div className="text-3xl font-bold mb-1">{stats.events}</div>
              <div className="text-sm text-primary-foreground/80">Events</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;