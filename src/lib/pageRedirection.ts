"use client";
import { useRouter } from "next/navigation";

const router = useRouter();

export default function pageRedirection(path: string) {
  router.push(path);
}
