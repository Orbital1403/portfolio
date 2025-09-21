import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { t as themeConfig } from '../chunks/index_BlF_e7rj.mjs';
import { g as getPosts } from '../chunks/index_Bd49nKCk.mjs';
export { renderers } from '../renderers.mjs';

const parser = new MarkdownIt();
const { title, description, website, author } = themeConfig.site;
const allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img"]);
async function GET(_context) {
  const posts = await getPosts();
  return rss({
    title,
    description,
    site: website,
    items: posts.map(getPostItem),
    customData: getCustomData()
  });
}
function getCustomData() {
  const follow = themeConfig.rss.follow;
  if (!follow)
    return "";
  const { feedId, userId } = follow;
  return `<follow_challenge><feedId>${feedId}</feedId><userId>${userId}</userId></follow_challenge>`;
}
function getPostItem(post) {
  const postItem = {
    link: `/posts/${post.id}/`,
    author: post.data.author ?? author,
    content: getPostContent(post),
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    customData: post.data.customData,
    categories: post.data.categories,
    commentsUrl: post.data.commentsUrl,
    source: post.data.source,
    enclosure: post.data.enclosure
  };
  return postItem;
}
function getPostContent(post) {
  const isFullText = themeConfig.rss.fullText;
  if (!isFullText)
    return post.data.description;
  return sanitizeHtml(parser.render(post.body || ""), { allowedTags });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
