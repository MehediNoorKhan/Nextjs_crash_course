import { EventItem } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

type Props = EventItem;

const EventCard = ({ title, image, date, slug, location, time }: Props) => {
  return (
    <div>
      <Link href={`/events/${slug}`} id="event-card">
        <div>
          <Image src={image} alt={title} height={300} width={410} />

          {/* Location row */}
          <div className="location mt-2 flex flex-row gap-2 ">
            <Image
              src="/icons/pin.svg"
              alt="location"
              width={14}
              height={14}
              className="shrink-0"
            />

            <p>{location}</p>
          </div>
          <p className="title mt-2">{title}</p>
          <div className="dateTime mt-2 flex flex-row gap-2 ">
            <div className="flex flex-row gap-2 ">
              <Image
                src="/icons/calendar.svg"
                alt="date"
                width={14}
                height={14}
                className="shrink-0"
              />
              <p>{date}</p>
            </div>
            <div className="flex flex-row gap-2 ">
              <Image
                src="/icons/clock.svg"
                alt="time"
                width={14}
                height={14}
                className="shrink-0"
              />
              <p>{time}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
