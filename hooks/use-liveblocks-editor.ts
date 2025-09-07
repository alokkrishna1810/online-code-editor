import { useRoom, useSelf, useOthers } from "@liveblocks/react";
import { useCallback, useEffect, useState } from "react";

export function useLiveblocksEditor(roomId: string) {
  const room = useRoom({ allowOutsideRoom: true });
  const self = useSelf();
  const others = useOthers();

  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [presence, setPresence] = useState<any[]>([]);

  // Initialize room data
  useEffect(() => {
    if (room) {
      room.getStorage().then((storage) => {
        const root = storage.root;
        const initialCode = root.get("code");
        const initialLanguage = root.get("language");

        setCode(typeof initialCode === "string" ? initialCode : "");
        setLanguage(
          typeof initialLanguage === "string" ? initialLanguage : "javascript"
        );
      });

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

  // Update code in Liveblocks storage
  const updateCode = useCallback(
    (newCode: string) => {
      if (room) {
        room.getStorage().then((storage) => {
          const root = storage.root;
          root.set("code", newCode);
          setCode(newCode);
        });
      }
    },
    [room]
  );

  // Update language in Liveblocks storage
  const updateLanguage = useCallback(
    (newLanguage: string) => {
      if (room) {
        room.getStorage().then((storage) => {
          const root = storage.root;
          root.set("language", newLanguage);
          setLanguage(newLanguage);
        });
      }
    },
    [room]
  );

  return {
    code,
    language,
    updateCode,
    updateLanguage,
    presence,
    self,
    others: others.length,
  };
}
