import { redirect } from "next/navigation";

export default function Home() {
  redirect("/translate");

  // This return statement is needed for TypeScript, but won't be reached
  return null;
}
