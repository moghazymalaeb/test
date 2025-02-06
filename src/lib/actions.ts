"use server";

import { ISidebarItem } from "@/types";
import { revalidatePath } from "next/cache";
import { get, post } from "./requests";

export async function getNavItems() {
  try {
    const response = await get<ISidebarItem[]>("/nav");

    if (!response.data) {
      throw new Error("Empty JSON response");
    }

    revalidatePath("/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
    throw error;
  }
}

export async function postTrackItem({ id, from, to }: { id: number; from: number; to: number }) {
  try {
    const response = await post("/track", { id, from, to });

    if (response.status === 204) {
      return { message: "No Content" };
    }

    return response.data;
  } catch (error) {
    console.error("Failed to post track item:", error);
    throw error;
  }
}

export const postSidebarItems = async (items: ISidebarItem[]) => {
  try {
    const response = await post("/nav", items);

    if (response.status === 204) {
      const updatedItems = await getNavItems();
      console.log("Items successfully saved");
      return updatedItems;
    } else {
      console.error("Failed to save items", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
