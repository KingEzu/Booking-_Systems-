import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// -----------------------------
// Sync user creation from Clerk
// -----------------------------
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await User.create(userData);
  }
);

// -----------------------------
// Sync user deletion from Clerk
// -----------------------------
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      console.log(`User with id ${id} not found in DB`);
    }
  }
);

// -----------------------------
// Sync user update from Clerk
// -----------------------------
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-with-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!updatedUser) {
      console.log(`User with id ${id} not found for update`);
    }
  }
);

// Export all Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
