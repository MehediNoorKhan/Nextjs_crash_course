import React from "react";
import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";
import { events } from "@/lib/constants";

const Page = () => {
 
  return (
    <section>
      <h1 className="text-center">
        Thew Hub for every dev <br /> Event you can't miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Conferences and Meetups, All in one place
      </p>
      <div className="max-w-55 mx-auto">
        <ExploreBtn />
      </div>
      <div className="mt-20 space-y-7">
        <h1>Featured Events</h1>
        <ul className="events list-none">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
