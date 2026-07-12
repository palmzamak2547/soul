"use client";

import { useCallback, useEffect, useState } from "react";

export type ResourceSource = "live" | "demo";

export type OpsResourceState<T> =
  | { status: "loading" }
  | { status: "unauthorized" }
  | { status: "error"; message: string }
  | { status: "empty"; source: ResourceSource }
  | { status: "ready"; data: T; source: ResourceSource };

type ApiEnvelope<T> = { data: T };

export function useOpsResource<T>(
  endpoint: string,
  demoData: T,
  isEmpty: (value: T) => boolean,
) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<OpsResourceState<T>>({ status: "loading" });

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(endpoint, {
          cache: "no-store",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (response.status === 401 || response.status === 403) {
          setState({ status: "unauthorized" });
          return;
        }

        // The operations routes intentionally remain useful while the production
        // API is being connected. A missing route selects deterministic demo data.
        if (response.status === 404 || response.status === 501) {
          setState(
            isEmpty(demoData)
              ? { status: "empty", source: "demo" }
              : { status: "ready", data: demoData, source: "demo" },
          );
          return;
        }

        if (!response.ok) {
          throw new Error(`ไม่สามารถโหลดข้อมูลได้ (${response.status})`);
        }

        const payload = (await response.json()) as ApiEnvelope<T>;
        if (isEmpty(payload.data)) {
          setState({ status: "empty", source: "live" });
          return;
        }

        setState({ status: "ready", data: payload.data, source: "live" });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        });
      }
    }

    void load();
    return () => controller.abort();
  }, [attempt, demoData, endpoint, isEmpty]);

  return { retry, state };
}

export async function runOpsMutation<TBody extends object>({
  body,
  endpoint,
  method = "POST",
  source,
}: {
  body: TBody;
  endpoint: string;
  method?: "POST" | "PATCH" | "DELETE";
  source: ResourceSource;
}) {
  if (source === "demo") {
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    return;
  }

  const response = await fetch(endpoint, {
    body: JSON.stringify(body),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "SOUL-Control-Center",
    },
    method,
  });

  if (!response.ok) {
    throw new Error(`บันทึกไม่สำเร็จ (${response.status})`);
  }
}

export const emptyArray = <T,>(value: T[]) => value.length === 0;

