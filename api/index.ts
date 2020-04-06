import { IncomingMessage, ServerResponse } from 'http';
import { getScreenshot } from './_lib/chromium';
import { getHtml } from './_lib/template';
import { writeTempFile, pathToFileURL } from './_lib/file';

const isDev = process.env.NOW_REGION === 'dev1';
const isHtmlDebug = process.env.OG_HTML_DEBUG === '1';

export default async function handler(
  _req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const html = await getHtml();
    if (isHtmlDebug) {
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
      return;
    }
    const filePath = await writeTempFile('ogimage', html);
    const fileUrl = pathToFileURL(filePath);
    const file = await getScreenshot(fileUrl, 'jpeg', isDev);
    res.statusCode = 200;
    res.setHeader('Content-Type', `image/jpeg`);
    res.setHeader('Cache-Control', `no-transform, no-store`);
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>');
    console.error(e);
  }
}
