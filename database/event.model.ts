import { Schema, model, models, type Document, type Model } from 'mongoose';

// Core Event shape used in the application layer.
export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // Normalized ISO date string (YYYY-MM-DD)
  time: string; // Normalized 24h time string (HH:MM)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose document type for Event with default document fields.
export interface EventDocument extends Event, Document {}

// Helper to generate a URL-friendly slug from an event title.
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/-+/g, '-'); // collapse multiple dashes
};

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Agenda must contain at least one item.',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => Array.isArray(value) && value.length > 0,
        message: 'Tags must contain at least one item.',
      },
    },
  },
  {
    // Automatically manages createdAt and updatedAt.
    timestamps: true,
    // Ignore fields not defined in the schema.
    strict: true,
  },
);

// Ensure a unique index on slug at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook to handle slug generation, date normalization, time validation, and required field checks.
eventSchema.pre<EventDocument>('save', function () {
  // Basic required field validation beyond Mongoose's required flags.
  const requiredStringFields: Array<keyof Event> = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'date',
    'time',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const value = this[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Field "${String(field)}" is required and cannot be empty.`);
    }
  }

  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error('Agenda must contain at least one item.');
  }

  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error('Tags must contain at least one tag.');
  }

  // Generate or regenerate slug only when the title has changed or slug is missing.
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }

  // Normalize and validate the date string to ISO date format (YYYY-MM-DD).
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format. Expected a valid date string.');
  }
  // Store only the calendar date portion for consistency.
  const isoDate = parsedDate.toISOString().split('T')[0];
  this.date = isoDate;

  // Validate time as 24h format HH:MM, zero-padded.
  const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!timePattern.test(this.time)) {
    throw new Error(
      'Invalid time format. Expected 24-hour time in the form HH:MM, e.g., 09:30 or 18:45.',
    );
  }

  // Normalize time to HH:MM format.
  const [hours, minutes] = this.time.split(':');
  const normalizedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  this.time = normalizedTime;
});

export type EventModel = Model<EventDocument>;

// Reuse existing model if it was already compiled (important for Next.js hot reloads).
export const Event: EventModel = models.Event || model<EventDocument>('Event', eventSchema);