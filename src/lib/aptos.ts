import { APTOS_NODE_URL } from "@/constants/contracts";

type ViewPayload = {
  function: string;
  type_arguments?: string[];
  arguments: any[];
};

export async function aptosView<T = any>(payload: ViewPayload): Promise<T> {
  const body = {
    function: payload.function,
    type_arguments: payload.type_arguments ?? [],
    arguments: payload.arguments ?? [],
  };
  const res = await fetch(`${APTOS_NODE_URL}/v1/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Aptos view failed: ${res.status} ${text}`);
  }
  return res.json();
}


