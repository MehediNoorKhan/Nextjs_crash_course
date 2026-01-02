export type EventItem = {
  id: number;
  title: string;
  slug: string;
  image: string;
  date: string;
  location: string;
  time: string;

}

export const events: EventItem[] = [
  {
    id: 1,
    title: "React Conference 2026",
    image: "/images/event1.png",
    date: "March 15-16, 2026",
    location: "Las Vegas, Nevada",
    slug: "slug 1",
    time: "9:00 am",
   
  },
  {
    id: 2,
    title: "Next.js Summit",
    image: "/images/event2.png",
    date: "April 8-9, 2026",
    location: "San Francisco, California",
    slug: "slug 2",
    time: "10:00 am",
    
   
  },
  {
    id: 3,
    title: "TypeScript World",
    image: "/images/event3.png",
    date: "May 20-21, 2026",
    location: "Berlin, Germany",
    slug: "slug 3",
    time: "10:00 am",
 
  },
  {
    id: 4,
    title: "JavaScript Global Summit",
    image: "/images/event4.png",
    date: "June 10-12, 2026",
    location: "New York, New York",
    slug: "slug 4",
    time: "11:00 am",
    
  },
  {
    id: 5,
    title: "Web Development Bootcamp Hackathon",
    image: "/images/event5.png",
    date: "July 5-7, 2026",
    location: "Austin, Texas",
    slug: "slug 5",
    time: "10:30 am",
    
  },
  {
    id: 6,
    title: "Full Stack Developers Meetup",
    image: "/images/event6.png",
    date: "August 1, 2026",
    location: "Toronto, Ontario",
    slug: "slug 6",
    time: "11:00 am",
    
  },
];
