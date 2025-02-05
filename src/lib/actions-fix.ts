"use server";

import { ISidebarItem } from "@/types";
import { revalidatePath } from "next/cache";

const API_BASE_URL = "http://localhost:8081";

// .. create main request this code shou
async function request(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return { message: 'No Content' };
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

export async function getNavItems() {
  try {
    const data = await request("/nav");
    
    if (!data) {
      throw new Error('Empty JSON response');
    }

    revalidatePath('/');
    return data;
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
    throw error;
  }
}

export async function postTrackItem({ id, from, to }: { id: number; from: number; to: number }) {
  return await request("/track", {
    method: 'POST',
    body: JSON.stringify({ id, from, to }),
  });
}

export const postSidebarItems = async (items: ISidebarItem[]) => {
  try {
    const response = await request("/nav", {
      method: 'POST',
      body: JSON.stringify(items),
    });

    if (response.message === 'No Content') {
      const updatedItems = await getNavItems();
      console.log('Items successfully saved');
      return updatedItems;
    }
    return response;
  } catch (error) {
    console.error('Error saving items:', error);
    return null;
  }
};
