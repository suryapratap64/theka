import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";
import Order from "../models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "theka" });

//Inngest Functions to save user data to a database
export const SyncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Your logic to handle the user creation event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    // Example: Save user data to a database or perform other actions
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
      cartItems: {},
    };
    await connectDB();
    await User.create(userData);
  }
);
//inngest fuction to update user data in the database
export const SyncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },

  async ({ event }) => {
    // Your logic to handle the user creation event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    // Example: Save user data to a database or perform other actions
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url,
      cartItems: {},
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

//ingest function to delete user data from the database

export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

//Inngest Function to create users order in database

export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      };
    });
    await connectDB();
    await Order.insertMany(orders);
    return { success: true, processed: orders.length };
  }
);
