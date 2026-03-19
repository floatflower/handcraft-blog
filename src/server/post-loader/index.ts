import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import parseMD from "parse-md";

export interface Post {
  slug: string;
  metadata: any;
  content: string;
}

const POSTS_DIR = join(process.cwd(), "public", "posts");

export function postLoader(): Post[] {
  let dirs: string[];
  try {
    dirs = readdirSync(POSTS_DIR);
  } catch {
    return [];
  }

  return dirs.reduce<Post[]>((acc, dir) => {
    try {
      const raw = readFileSync(join(POSTS_DIR, dir, "content.md"), "utf-8");
      const { metadata, content } = parseMD(raw);
      acc.push({ slug: dir, metadata, content });
    } catch {
      // skip directories without content.md
    }
    return acc;
  }, []);
}
