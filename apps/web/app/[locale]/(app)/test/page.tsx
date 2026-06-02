import { auth } from "@/auth";

export default async function TestPage() {
  const session = await auth();
  const token = session?.accessToken;

  for (let i = 0; i <= 300; i++) {
    const res = await fetch(`${process.env.AUTH_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
      cache: "no-store",
    });
    console.log(res.status);
    console.log(token);
  }

  return <div></div>;
}
