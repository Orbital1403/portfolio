import { a as getCollection } from './_astro_content_CSmP2T4k.mjs';
import dayjs from 'dayjs';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

async function getCategories() {
  const posts = await getPosts();
  const categories = /* @__PURE__ */ new Map();
  for (const post of posts) {
    if (post.data.categories) {
      for (const c of post.data.categories) {
        const posts2 = categories.get(c) || [];
        posts2.push(post);
        categories.set(c, posts2);
      }
    }
  }
  return categories;
}
async function getPosts(isArchivePage = false) {
  const posts = await getCollection("posts");
  posts.sort((a, b) => {
    if (isArchivePage) {
      return dayjs(a.data.pubDate).isBefore(dayjs(b.data.pubDate)) ? 1 : -1;
    }
    const aDate = a.data.modDate ? dayjs(a.data.modDate) : dayjs(a.data.pubDate);
    const bDate = b.data.modDate ? dayjs(b.data.modDate) : dayjs(b.data.pubDate);
    return aDate.isBefore(bDate) ? 1 : -1;
  });
  {
    return posts.filter((post) => post.data.draft !== true);
  }
}
const parser = new MarkdownIt();
function getPostDescription(post) {
  if (post.data.description) {
    return post.data.description;
  }
  const html = parser.render(post.body || "");
  const sanitized = sanitizeHtml(html, { allowedTags: [] });
  return sanitized.slice(0, 400);
}
function formatDate(date, format = "YYYY-MM-DD") {
  return dayjs(date).format(format);
}
function formatYear(date) {
  const d = new Date(date);
  return d.getFullYear();
}
function getPathFromCategory(category, category_map) {
  const mappingPath = category_map.find((l) => l.name === category);
  return mappingPath ? mappingPath.path : category;
}

export { getCategories as a, getPathFromCategory as b, getPostDescription as c, formatYear as d, formatDate as f, getPosts as g };
