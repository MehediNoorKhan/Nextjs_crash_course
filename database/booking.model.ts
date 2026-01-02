import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';
import { Event } from './event.model';

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingDocument extends Booking, Document {}

// Simple email validation pattern for basic format checking.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // Index on eventId for efficient lookups.
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// Additional index definition for clarity (in addition to the field-level index).
bookingSchema.index({ eventId: 1 });

// Pre-save hook validates email format and ensures the referenced event exists.
bookingSchema.pre<BookingDocument>('save', async function () {
  if (!emailPattern.test(this.email)) {
    throw new Error('Invalid email address.');
  }

  // Verify the referenced event exists before creating a booking.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error('Cannot create booking: referenced event does not exist.');
  }
});

export type BookingModel = Model<BookingDocument>;

export const Booking: BookingModel =
  models.Booking || model<BookingDocument>('Booking', bookingSchema);