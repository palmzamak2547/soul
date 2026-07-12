import { getSoulRepository, type SoulRepository } from "@/lib/soul/repository";
import type {
  CardTokenResolution,
  NfcPrototypeAssurance,
} from "@/lib/soul/types";

export const NTAG216_PROTOTYPE_LIMITATIONS = [
  "NTAG216 URL ในต้นแบบเป็น static token จึงถูกคัดลอกและ replay ได้",
  "เว็บเบราว์เซอร์ไม่ได้รับ hardware UID ที่เชื่อถือได้จากการเปิด URL",
  "NTAG216 ไม่มี secure dynamic challenge สำหรับพิสูจน์ว่าแตะชิปต้นฉบับ",
  "การพบ token พิสูจน์ได้เพียงว่าระบบรู้จักลิงก์ ไม่ได้พิสูจน์ความเป็นเจ้าของการ์ด",
] as const;

function assurance(tokenMatched: boolean): NfcPrototypeAssurance {
  return {
    tagFamily: "NTAG216",
    mode: "static_demo_token",
    tokenMatched,
    cryptographicAuthenticity: false,
    ownershipGranted: false,
    limitations: NTAG216_PROTOTYPE_LIMITATIONS,
  };
}

/**
 * Resolves only the fictional static tokens bundled with this prototype.
 * This is deliberately not named `verify`: an NTAG216 static URL cannot
 * provide cryptographic tap authenticity or card ownership.
 */
export async function resolveDemoCardToken(
  rawToken: string,
  repository: SoulRepository = getSoulRepository(),
): Promise<CardTokenResolution> {
  const token = rawToken.trim();
  const card = await repository.findCardByPublicToken(token);

  if (!card) {
    return { status: "not_found", nfc: assurance(false) };
  }

  return {
    status: "resolved",
    card: await repository.toPublicCard(card),
    nfc: assurance(true),
  };
}

