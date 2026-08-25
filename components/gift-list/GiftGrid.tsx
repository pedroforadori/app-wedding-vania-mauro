"use client";

import { use } from "react";
import type { Gift } from "@/types/gift";
import GiftCard from "./GiftCard";

export default function GiftGrid({
  giftsPromise,
  pixEnabled,
}: {
  giftsPromise: Promise<Gift[]>;
  pixEnabled: boolean;
}) {
  const gifts = use(giftsPromise);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift) => (
        <GiftCard key={gift.id} gift={gift} pixEnabled={pixEnabled} />
      ))}
    </div>
  );
}
