import { useEffect, useState } from "react";
import { useRoom, useSelf, useOthers } from "@liveblocks/react";

export function useLiveblocksPresence() {
  const room = useRoom({ allowOutsideRoom: true });
  const self = useSelf();
  const others = useOthers();

  const [presence, setPresence] = useState<any[]>([]);

  useEffect(() => {
    if (room) {
      // Subscribe to presence changes
      const unsubscribe = room.subscribe("others", (others) => {
        const presenceData = others.map((other) => ({
          id: other.id,
          info: other.info,
          presence: other.presence,
        }));
        setPresence(presenceData);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [room]);

  return { presence, self, others: others.length };
}
