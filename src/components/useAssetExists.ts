import { useCallback, useEffect, useState } from "react";
import { staticFile, useDelayRender } from "remotion";

/**
 * public/ 안의 파일이 실제로 존재하는지 확인한다.
 * 파일이 없어도 빌드/렌더가 깨지지 않도록, 결과가 나올 때까지만 렌더를 지연시킨다.
 *
 * @returns `null` = 확인 중, `true` = 있음, `false` = 없음
 */
export const useAssetExists = (path: string): boolean | null => {
  const [exists, setExists] = useState<boolean | null>(null);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`에셋 확인: ${path}`));

  const check = useCallback(async () => {
    try {
      const url = staticFile(path);
      const res = await fetch(url, { method: "HEAD" });
      // HEAD 를 지원하지 않는 서버는 GET 으로 다시 확인한다.
      const ok =
        res.status === 405 || res.status === 501
          ? (await fetch(url)).ok
          : res.ok;
      setExists(ok);
    } catch {
      setExists(false);
    } finally {
      continueRender(handle);
    }
  }, [path, handle, continueRender]);

  useEffect(() => {
    check();
  }, [check]);

  return exists;
};

/**
 * 후보 경로들을 순서대로 확인해서 처음 존재하는 것을 돌려준다.
 * (예: mp3 가 없으면 wav 로 폴백)
 *
 * @returns `undefined` = 확인 중, `null` = 전부 없음, 그 외 = 찾은 경로
 */
export const useFirstExistingAsset = (
  candidates: readonly string[],
): string | null | undefined => {
  const [found, setFound] = useState<string | null | undefined>(undefined);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() =>
    delayRender(`에셋 확인: ${candidates.join(", ")}`),
  );
  const key = candidates.join("|");

  const check = useCallback(async () => {
    try {
      for (const path of key.split("|")) {
        const url = staticFile(path);
        const res = await fetch(url, { method: "HEAD" });
        const ok =
          res.status === 405 || res.status === 501
            ? (await fetch(url)).ok
            : res.ok;
        if (ok) {
          setFound(path);
          return;
        }
      }
      setFound(null);
    } catch {
      setFound(null);
    } finally {
      continueRender(handle);
    }
  }, [key, handle, continueRender]);

  useEffect(() => {
    check();
  }, [check]);

  return found;
};
