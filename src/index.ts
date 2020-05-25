import Koa from "koa";
import bodyParser from "koa-bodyparser";
import morgan from "koa-morgan";
import Pug from "koa-pug";
import Router from "koa-router";
import mime from "mime-types";
import youtubedl from "youtube-dl";
import { PORT, HOSTNAME, BACKLOG, VIEWS_DIR, DEBUG } from "./Constants";
import { inspect } from "util";

const app = new Koa();
const pug = new Pug({
  viewPath: VIEWS_DIR,
  basedir: VIEWS_DIR,
  app
});

app.use(morgan("combined"));
app.use(bodyParser());

const router = new Router();

router.get("/", async ctx => {
  await ctx.render("index.pug");
});

router.post("/download", async ctx => {
  const { 'download-url': downloadUrl } = ctx.request.body;

  try {
    new URL(downloadUrl);
  } catch (e) {
    if (DEBUG) console.error(e);
    if (e instanceof Error) {
      return ctx.body = { message: e.message };
    }
    return ctx.body = { message: "Internal Server Error" };
  }

  const video = youtubedl(downloadUrl, [ ], {});

  const { ext, title } = await new Promise(resolve => video.on('info', (info: any) => resolve({ ext: info.ext, title: info.title })));

  ctx.set('Content-Type', mime.lookup(ext) as string);
  ctx.set('Content-Disposition', `attachment; filename="${title}.${ext}"`)

  ctx.body = video;
});

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, HOSTNAME, BACKLOG, () => {
  console.log(`Listening on ${HOSTNAME || '*'}:${PORT}`);
});