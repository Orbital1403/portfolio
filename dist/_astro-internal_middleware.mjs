import 'es-module-lexer';
import './chunks/shared_9gEenf6c.mjs';
import { appendForwardSlash, removeTrailingForwardSlash } from '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { o as originPathnameSymbol, A as AstroError, F as ForbiddenRewrite } from './chunks/astro/server_CZ9E4fRZ.mjs';
import 'clsx';
import 'cookie';
import 'html-escaper';
import { t as themeConfig } from './chunks/index_BlF_e7rj.mjs';

function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}

function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) {
    pathname = "/";
  }
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") {
    finalPathname = "/";
  } else if (shouldAppendSlash) {
    finalPathname = appendForwardSlash(pathname);
  } else {
    finalPathname = removeTrailingForwardSlash(pathname);
  }
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}

function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i + 1] ? paramsMatch[i + 1] : void 0;
    } else {
      params[key] = paramsMatch[i + 1];
    }
  });
  return params;
}

const apiContextRoutesSymbol = Symbol.for("context.routes");

function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, async (payload) => {
        if (i < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request.clone());
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request.clone()
              );
            }
            const oldPathname = handleContext.url.pathname;
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(
              handleContext.request,
              oldPathname,
              pipeline.manifest.trailingSlash,
              pipeline.manifest.buildFormat
            );
          }
          return applyHandle(i + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}

function defineMiddleware(fn) {
  return fn;
}

const LANGUAGES = {
  "en-us": {
    Home: "Home",
    Posts: "Posts",
    Categories: "Categories",
    Archive: "Archive",
    Tags: "Tags",
    About: "About",
    Links: "Links",
    posted_at: "Posted at",
    updated_at: "Updated at",
    tag_count: "%d tags",
    archive_count: "%d post",
    categories_count: "%d post",
    page_count: "%d",
    page_number: "Page %d",
    all_posts: "All Posts",
    comments: "comments",
    share: "Share",
    prev: "Previous",
    next: "Next",
    prev_post: "Previous post",
    next_post: "Next post"
  },
  "hr-hr": {
    Home: "Početna",
    Posts: "Objave",
    Categories: "Kategorije",
    Archive: "Arhiva",
    Tags: "Oznake",
    About: "O meni",
    Links: "Linkovi",
    posted_at: "Objavljeno",
    updated_at: "Ažurirano",
    tag_count: "%d oznaka",
    archive_count: "%d objava",
    categories_count: "%d objava",
    page_count: "%d",
    page_number: "Stranica %d",
    all_posts: "Sve objave",
    comments: "komentari",
    share: "Podijeli",
    prev: "Prethodna",
    next: "Sljedeća",
    prev_post: "Prethodna objava",
    next_post: "Sljedeća objava"
  }
};

const onRequest$1 = defineMiddleware(async (context, next) => {
  const locale = themeConfig.appearance.locale;
  const localeTranslate = LANGUAGES[locale];
  function validateKey(key) {
    return key in localeTranslate;
  }
  context.locals.translate = (key, param) => {
    if (!validateKey(key))
      return key;
    if (!param)
      return localeTranslate[key];
    return localeTranslate[key].replace("%d", param.toString());
  };
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
