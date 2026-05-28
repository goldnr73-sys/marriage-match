"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TestRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checklist = searchParams.get("checklist") ?? "";

  useEffect(() => {
    router.replace(`/chat?checklist=${checklist}`);
  }, [router, checklist]);

  return null;
}

export default function TestPage() {
  return (
    <Suspense fallback={null}>
      <TestRedirect />
    </Suspense>
  );
}
