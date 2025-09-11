import { FETCH_USER_BY_ID } from "@/graphql/queries";

export async function getUser(userId: string | undefined) {
  if (!userId) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: FETCH_USER_BY_ID,
        variables: { userId },
      }),
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.warn(`HTTP error! status: ${response.status}`);
      return null;
    }

    const { data, errors } = await response.json();
    if (errors) {
      console.warn("GraphQL Errors:", errors);
      return null;
    }

    return data.fetchUsersById;
  } catch (error) {
    console.warn("Failed to fetch user data:", error);
    return null;
  }
}