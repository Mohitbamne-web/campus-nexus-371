import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  max_attendees: number | null;
  event_registrations: { count: number }[];
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    fetchEvents();

    return () => subscription.unsubscribe();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select(`
        *,
        event_registrations(count)
      `)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(3);

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error("Please sign in to register for events");
      return;
    }

    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: user.id });

    if (error) {
      toast.error("Failed to register for event");
    } else {
      toast.success("Successfully registered!");
      fetchEvents();
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">Don't miss out on exciting campus activities</p>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No upcoming events scheduled.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const attendeeCount = event.event_registrations?.[0]?.count || 0;
              const spotsLeft = event.max_attendees ? event.max_attendees - attendeeCount : null;

              return (
                <Card key={event.id} className="hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{event.category}</Badge>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(event.event_date), "MMM dd, yyyy")} • {event.start_time} - {event.end_time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {attendeeCount} attending
                        {spotsLeft !== null && ` • ${spotsLeft} spots left`}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;