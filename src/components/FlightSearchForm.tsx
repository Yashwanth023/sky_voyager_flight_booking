
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AirportSearch } from "./AirportSearch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const flightSearchSchema = z.object({
  from: z.string().min(3, "Please select a departure airport"),
  to: z.string().min(3, "Please select an arrival airport"),
  date: z.date({ required_error: "Please select a date" }),
});

export type FlightSearchValues = z.infer<typeof flightSearchSchema>;

export function FlightSearchForm() {
  const navigate = useNavigate();
  const [openCalendar, setOpenCalendar] = useState(false);

  const form = useForm<FlightSearchValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      from: "",
      to: "",
    },
  });

  function onSubmit(values: FlightSearchValues) {
    const searchParams = new URLSearchParams();
    searchParams.set("from", values.from);
    searchParams.set("to", values.to);
    searchParams.set("date", format(values.date, "yyyy-MM-dd"));
    navigate(`/search?${searchParams.toString()}`);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-card rounded-lg p-6 shadow-lg border border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <div className="lg:col-span-3">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AirportSearch
                        label="From"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select departure airport"
                        excludeCode={form.watch("to")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-3">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AirportSearch
                        label="To"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select arrival airport"
                        excludeCode={form.watch("from")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">Date</FormLabel>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-14",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenCalendar(false);
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="px-10 bg-primary hover:bg-primary/90 shadow-md">
              Search Flights
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
